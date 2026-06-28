/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, ReactNode, MouseEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import CryptoHistory from './components/CryptoHistory';
import ClaimReward from './components/ClaimReward';
import TelegramCommunityHub from './components/TelegramCommunityHub';
import EcosystemActivityLog from './components/EcosystemActivityLog';
import WalletInfoCard from './components/WalletInfoCard';
import VerseEcosystemBook from './components/VerseEcosystemBook';
import CryptoEncyclopedia from './components/CryptoEncyclopedia';
import VerseInteractiveHub from './components/VerseInteractiveHub';
import { AdminDashboard } from './components/AdminDashboard';
import { 
  auth, 
  db, 
  doc, 
  setDoc, 
  collection, 
  addDoc, 
  serverTimestamp, 
  increment, 
  onAuthStateChanged,
  User,
  arrayUnion
} from './lib/firebase';
import { useSecurity } from './components/SecurityFirewall';
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
  ChevronUp,
  ChevronDown,
  PlusCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Globe,
  BookOpen,
  CalendarRange,
  Bell,
  Trash2,
  Users,
  Phone,
  Lightbulb,
  ExternalLink
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
type GameState = 'home' | 'clicker' | 'quiz' | 'wallet' | 'bitcoinWallet' | 'cryptoHistory' | 'claimReward' | 'ecosystemBook' | 'cryptoEncyclopedia' | 'verseInteractiveHub' | 'verseCommunityHub' | 'ecosystemActivityLog' | 'ourVerseCommunity';

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

const FOOTER_LEARN_EN = [
  "Our website has been designed to help both beginners and experienced users gain practical knowledge about the world of cryptocurrency in an easy and engaging way.",
  "One of the key features of the platform is the Verse Token System. Through quizzes, educational activities, and community participation, users can earn VERT tokens. These earned tokens are added to your Verse Wallet, where you can experience how a crypto wallet works in a realistic learning environment.",
  "Through this platform, you can learn:\n• How to earn tokens\n• How to use a crypto wallet\n• How to track digital assets\n• How to trade tokens\n• How to swap and convert cryptocurrencies\n• How to manage digital assets effectively",
  "My goal was to create a platform that goes beyond theory and provides a learning experience that closely reflects real-world crypto activities. For this reason, every section of the website has been designed to be as practical and realistic as possible.",
  "Our community is built on trust, education, and mutual support. Just as it has gained recognition and popularity in the past, it continues to grow today, and we believe its impact and reach will become even greater in the future.",
  "The website also includes a variety of valuable resources, including:\n• Official community links\n• Community group links\n• Bitcoin.com Wallet download links\n• Information about Verse Token\n• Educational guides and reference materials",
  "Our mission is to educate, empower, and guide people in understanding cryptocurrency and blockchain technology. Through this platform, we aim to help users build knowledge, develop practical skills, and gain confidence in navigating the crypto ecosystem.",
  "We invite you to join the Verse Community, participate in our learning ecosystem, and grow alongside a community that values knowledge, innovation, and opportunity.",
  "This website was created with one primary purpose: to help people learn, understand, and gain real-world knowledge about the crypto industry in a simple, accessible, and engaging way."
];

const FOOTER_LEARN_BN = [
  "আমাদের ওয়েবসাইটটি এমনভাবে তৈরি করা হয়েছে যাতে নতুন এবং অভিজ্ঞ উভয় ধরনের ব্যবহারকারীই ক্রিপ্টোকারেন্সির জগৎ সম্পর্কে অত্যন্ত সহজে এবং আকর্ষণীয় উপায়ে বাস্তব জ্ঞান অর্জন করতে পারেন।",
  "এই প্ল্যাটফর্মের অন্যতম মূল বৈশিষ্ট্য হলো Verse Token System (ভার্স টোকেন সিস্টেম)। কুইজ, শিক্ষামূলক কার্যক্রম এবং কমিউনিটিতে সক্রিয় অংশগ্রহণের মাধ্যমে ব্যবহারকারীরা VERT টোকেন উপার্জন করতে পারেন। এই উপার্জিত টোকেনগুলো আপনার Verse ওয়ালেটে যোগ হয়ে যাবে, যেখানে আপনি একটি বাস্তবসম্মত শিক্ষার পরিবেশে ক্রিপ্টো ওয়ালেট কীভাবে কাজ করে তা সরাসরি অনুভব করতে পারবেন।",
  "এই প্ল্যাটফর্মের মাধ্যমে আপনি যা শিখতে পারবেন:\n• কীভাবে টোকেন উপার্জন করতে হয়\n• কীভাবে একটি ক্রিপ্টো ওয়ালেট ব্যবহার করতে হয়\n• কীভাবে ডিজিটাল সম্পদ ট্র্যাক করতে হয়\n• কীভাবে টোকেন ট্রেড বা কেনাবেচা করতে হয়\n• কীভাবে ক্রিপ্টোকারেন্সি সোয়াপ এবং কনভার্ট করতে হয়\n• কীভাবে ডিজিটাল সম্পদ কার্যকরভাবে পরিচালনা করতে হয়",
  "আমার লক্ষ্য ছিল এমন একটি প্ল্যাটফর্ম তৈরি করা যা শুধুমাত্র তাত্ত্বিক আলোচনার বাইরে গিয়ে ব্যবহারকারীকে বাস্তবসম্মত ক্রিপ্টো কার্যক্রমের অভিজ্ঞতা প্রদান করবে। এই কারণেই, ওয়েবসাইটের প্রতিটি বিভাগকে যতটা সম্ভব ব্যবহারিক এবং বাস্তবসম্মত করে ডিজাইন করা হয়েছে।",
  "আমাদের কমিউনিটি গড়ে উঠেছে বিশ্বাস, শিক্ষা এবং পারস্পরিক সহযোগিতার ওপর ভিত্তি করে। অতীতে এটি যেভাবে পরিচিতি এবং জনপ্রিয়তা লাভ করেছিল, আজকেও এটি সেভাবেই প্রতিনিয়ত বৃদ্ধি পাচ্ছে। আমরা বিশ্বাস করি যে ভবিষ্যতে এর প্রভাব এবং পরিধি আরও অনেক গুণ বৃদ্ধি পাবে।",
  "এই ওয়েবসাইটে বেশ কিছু মূল্যবান রিসোর্স বা তথ্য উৎসও অন্তর্ভুক্ত রয়েছে, যার মধ্যে রয়েছে:\n• অফিসিয়াল কমিউনিটি লিংক\n• কমিউনিটি গ্রুপ লিংক\n• Bitcoin.com ওয়ালেট ডাউনলোড লিংক\n• Verse টোকেন সংক্রান্ত প্রয়োজনীয় তথ্য\n• শিক্ষামূলক গাইড এবং রেফারেন্স রেফারেন্স বিষয়ক উপাদানসমূহ",
  "আমাদের মিশন হলো মানুষকে ক্রিপ্টোকারেন্সি এবং ব্লকচেইন প্রযুক্তি বুঝতে সাহায্য করা, তাদের স্বাবলম্বী করা এবং সঠিক দিকনির্দেশনা দেওয়া। এই প্ল্যাটফর্মের মাধ্যমে আমরা ব্যবহারকারীদের জ্ঞান বৃদ্ধি করতে, ব্যবহারিক দক্ষতা উন্নত করতে এবং ক্রিপ্টো ইকোসিস্টেমে আত্মবিশ্বাসের সাথে পথ চলতে সাহায্য করতে চাই।",
  "আমরা আপনাকে Verse কমিউনিটিতে যোগ দিতে, আমাদের শিক্ষামূলক ইকোসিস্টেমে অংশ নিতে এবং এমন একটি কমিউনিটির সাথে একসাথে এগিয়ে যেতে আমন্ত্রণ জানাই যা জ্ঞান, উদ্ভাবন এবং সুযোগকে মূল্য দেয়।",
  "এই ওয়েবসাইটটি মূলত একটি প্রধান উদ্দেশ্য নিয়ে তৈরি করা হয়েছে: মানুষকে অত্যন্ত সহজ, সহজলভ্য এবং আকর্ষণীয় উপায়ে ক্রিপ্টো ইন্ডাস্ট্রি সম্পর্কে সঠিক এবং বাস্তবমুখী জ্ঞান অর্জন করতে সহায়তা করা।"
];

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
  },
  {
    subtitle: "VERSE ECOSYSTEM STUDY",
    title: "Verse Ecosystem Book Explained",
    content: "In the Verse Ecosystem Book, I have explained the concept of an ecosystem in a simple and easy-to-understand way. Readers can learn what an ecosystem is, how an ecosystem network is built, how it operates, how it grows, and how it expands over time.",
    detail: "In the Verse Ecosystem Book, I have explained the concept of an ecosystem in a simple and easy-to-understand way. Readers can learn what an ecosystem is, how an ecosystem network is built, how it operates, how it grows, and how it expands over time."
  },
  {
    subtitle: "COMPREHENSIVE BLOCKCHAIN GLOSSARY",
    title: "Crypto Encyclopedia Q&A",
    content: "I have also included the Crypto Encyclopedia, where I discuss a wide range of topics related to the cryptocurrency industry. To help users gain knowledge and understanding, I have added more than 250 carefully selected questions and answers covering various aspects of the crypto world.",
    detail: "I have also included the Crypto Encyclopedia, where I discuss a wide range of topics related to the cryptocurrency industry. To help users gain knowledge and understanding, I have added more than 250 carefully selected questions and answers covering various aspects of the crypto world."
  },
  {
    subtitle: "VALUABLE INSIGHTS",
    title: "Crypto Industry Learning",
    content: "By studying these questions attentively, you will gain valuable insights into cryptocurrencies, blockchain networks, digital assets, and the overall crypto ecosystem. This knowledge can help you better understand how the industry works and make more informed decisions.",
    detail: "By studying these questions attentively, you will gain valuable insights into cryptocurrencies, blockchain networks, digital assets, and the overall crypto ecosystem. This knowledge can help you better understand how the industry works and make more informed decisions."
  },
  {
    subtitle: "TRANSACTION SECURITY PROTOCOLS",
    title: "Crypto Transactions & Security Awareness",
    content: "In addition, I have included content focused on crypto transactions and security awareness. These resources are designed to help users recognize risks, stay cautious, and build confidence while navigating the crypto space. Whether you are a beginner or someone looking to expand your knowledge, this material provides a strong foundation for your crypto journey.",
    detail: "In addition, I have included content focused on crypto transactions and security awareness. These resources are designed to help users recognize risks, stay cautious, and build confidence while navigating the crypto space. Whether you are a beginner or someone looking to expand your knowledge, this material provides a strong foundation for your crypto journey."
  },
  {
    subtitle: "VERSE INTERACTIVE PORTAL",
    title: "Verse Interactive Hub",
    content: "I have also created the Verse Interactive Hub, where I further explore ecosystem concepts, community building, and many other important topics. Through interactive quizzes and educational content, users can learn how different systems function, how communities grow, and how decentralized networks operate.",
    detail: "I have also created the Verse Interactive Hub, where I further explore ecosystem concepts, community building, and many other important topics. Through interactive quizzes and educational content, users can learn how different systems function, how communities grow, and how decentralized networks operate."
  },
  {
    subtitle: "DECENTRALIZED SOCIAL SPHERE",
    title: "Join the Verse Community Network",
    content: "We invite you to join the Verse Community, expand your influence, contribute positively to the community, and grow alongside like-minded individuals. By sharing your knowledge, support, and engagement, you can help build a stronger ecosystem while creating opportunities for your own future.",
    detail: "We invite you to join the Verse Community, expand your influence, contribute positively to the community, and grow alongside like-minded individuals. By sharing your knowledge, support, and engagement, you can help build a stronger ecosystem while creating opportunities for your own future."
  },
  {
    subtitle: "DECENTRALIZED VISION",
    title: "Our Ultimate Community Mission",
    content: "Our mission is to educate, empower, and guide people toward a better understanding of the crypto world. We hope that the Verse Community will become a valuable source of learning, growth, and opportunity for everyone who joins.",
    detail: "Our mission is to educate, empower, and guide people toward a better understanding of the crypto world. We hope that the Verse Community will become a valuable source of learning, growth, and opportunity for everyone who joins."
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
  const { triggerAction } = useSecurity();
  const [gameState, setGameState] = useState<GameState>('home');
  const [showSettings, setShowSettings] = useState(false);
  const [settingsSubView, setSettingsSubView] = useState<'main' | 'download' | 'join' | 'language' | 'display' | 'about' | 'contact' | 'wallet_about'>('main');
  const [displayMode, setDisplayMode] = useState<'light' | 'dark'>(() => {
    return (safeStorage.getItem('displayMode') as any) || 'light';
  });
  const [appLanguage, setAppLanguage] = useState<'en' | 'bn'>('en');

  // Firebase Auth and Admin Dashboard states
  const { clientMeta } = useSecurity();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'admin'>('admin');
  const [userPhoto, setUserPhoto] = useState<string>('https://i.ibb.co.com/bRMwqvJz/IMG-20260530-154814.jpg');
  const [userDisplayName, setUserDisplayName] = useState<string>('Juwel Rana');
  const [authInitialized, setAuthInitialized] = useState(false);

  const t = (en: string, bn: string) => {
    return en;
  };

  // Firebase Auth & Live Visitor Tracking Engine
  useEffect(() => {
    // 1. Subscribe to Auth
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setUsername(user.email || 'user');
        setUserDisplayName(user.displayName || user.email?.split('@')[0] || 'User');
        setUserPhoto(user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop');
        safeStorage.setItem('verseUser', user.email || 'user');

        // Fetch additional user role details
        try {
          const userRef = doc(db, 'users', user.uid);
          
          // Set sensible defaults before fetching (e.g. if offline)
          if (user.email === 'mdjuwelranajx127133@gmail.com' || user.email?.endsWith('@gmail.com')) {
            setUserRole('admin');
          } else {
            setUserRole('user');
          }

          // Since getDoc is exported, we use dynamic/straight approach:
          const { getDoc } = await import('./lib/firebase');
          const finalSnap = await getDoc(userRef);
          
          if (finalSnap.exists()) {
            const data = finalSnap.data();
            if (data.role) {
              setUserRole(data.role as any);
            }
            if (data.name) {
              setUserDisplayName(data.name);
            }
            if (data.photoURL) {
              setUserPhoto(data.photoURL);
            }
          } else {
            // Document doesn't exist, create it (just in case)
            let defaultRole = 'user';
            if (user.email === 'mdjuwelranajx127133@gmail.com' || user.email?.endsWith('@gmail.com')) {
              defaultRole = 'admin';
              setUserRole('admin');
            }
            await setDoc(userRef, {
              uid: user.uid,
              name: user.displayName || user.email?.split('@')[0] || 'User',
              email: user.email || '',
              photoURL: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
              role: defaultRole,
              createdAt: serverTimestamp(),
              lastActive: serverTimestamp(),
              country: clientMeta?.country || 'Bangladesh',
              city: clientMeta?.city || 'Dhaka',
              device: clientMeta?.os || 'Secure Desktop'
            });
          }
        } catch (e: any) {
          const errMsg = e?.message || String(e);
          if (errMsg.includes('offline') || errMsg.includes('Failed to get document') || errMsg.includes('unavailable')) {
            console.warn('Network is offline or Firestore is unavailable. Falling back to default user state.', e);
          } else {
            console.error('Error fetching role:', e);
          }
        }
      } else {
        setCurrentUser(null);
        setUsername(null);
        setUserRole('user');
        safeStorage.removeItem('verseUser');
      }
      setAuthInitialized(true);
    });

    // 2. Track Web Visitors (Requirement 7)
    const initVisitor = async () => {
      try {
        let visitorSessionId = sessionStorage.getItem('verse_visitor_session');
        const meta = {
          ip: clientMeta?.ip || '127.0.0.1',
          country: clientMeta?.country || 'Bangladesh',
          city: clientMeta?.city || 'Dhaka',
          browser: clientMeta?.browser || 'Secure Chrome',
          device: clientMeta?.os || 'Desktop/Windows'
        };

        if (!visitorSessionId) {
          visitorSessionId = 'vis_' + Math.random().toString(36).substring(2, 15);
          sessionStorage.setItem('verse_visitor_session', visitorSessionId);

          // Add to Firestore visitors
          await setDoc(doc(db, 'visitors', visitorSessionId), {
            id: visitorSessionId,
            ...meta,
            timestamp: serverTimestamp(),
            timeSpent: 0,
            pagesVisited: ['Home']
          });

          // Increment Total Visitors in analytics counter
          await setDoc(doc(db, 'counters', 'analytics'), {
            totalVisitors: increment(1)
          }, { merge: true });
        }

        // Periodically update active session time spent (every 15 seconds)
        const timer = setInterval(async () => {
          try {
            await setDoc(doc(db, 'visitors', visitorSessionId!), {
              timeSpent: increment(15),
              lastPing: serverTimestamp()
            }, { merge: true });
          } catch (err) {
            console.error('Error pinging visitor session:', err);
          }
        }, 15000);

        return () => clearInterval(timer);
      } catch (e) {
        console.error('Error tracking visitor session:', e);
      }
    };

    initVisitor();

    return () => {
      unsubscribe();
    };
  }, [clientMeta]);

  // Track pages visited whenever route changes (Requirement 7)
  useEffect(() => {
    const trackPageChange = async () => {
      try {
        const session = sessionStorage.getItem('verse_visitor_session');
        if (session) {
          await setDoc(doc(db, 'visitors', session), {
            pagesVisited: arrayUnion(gameState)
          }, { merge: true });
        }
      } catch (err) {
        console.error('Error tracking page transition:', err);
      }
    };
    if (gameState) {
      trackPageChange();
    }
  }, [gameState]);

  // Sync state transitions to anti-flooding engine
  useEffect(() => {
    triggerAction('navigation', `Route transition triggered to section: ${gameState}`);
  }, [gameState]);

  const [username, setUsername] = useState<string | null>(() => {
    const saved = safeStorage.getItem('verseUser');
    return saved || 'mdjuwelranajx127133@gmail.com';
  });
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const [footerDescExpanded, setFooterDescExpanded] = useState<boolean>(false);
  const [footerDescLang, setFooterDescLang] = useState<'en' | 'bn'>('en');
  
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

  const [isNavigatingTopic, setIsNavigatingTopic] = useState(false);
  const [navigatingTopicName, setNavigatingTopicName] = useState('');
  const [navigateTargetState, setNavigateTargetState] = useState<GameState>('home');
  const [topicLoadingProgress, setTopicLoadingProgress] = useState(0);

  const navigationTopics = [
    {
      id: 'bitcoinWallet' as GameState,
      title: 'Bitcoin.com Wallet',
      subtitle: 'NATIVE WALLET PORTAL',
      desc: 'Learn how to use the Bitcoin.com Wallet with simple educational demos. Explore wallet setup, transactions, and basic features for learning purposes only.',
      logoUrl: 'https://i.ibb.co.com/bRMwqvJz/IMG-20260530-154814.jpg',
      colorFrom: 'from-blue-600',
      colorTo: 'to-indigo-600',
      tag: 'FEATURED',
      glow: 'rgba(59, 130, 246, 0.4)'
    },
    {
      id: 'cryptoHistory' as GameState,
      title: 'Crypto Founder and History',
      subtitle: 'BLOCKCHAIN ARCHIVE',
      desc: 'Founders, historical dates, and pioneering discoveries.',
      logoUrl: 'https://i.ibb.co.com/hx1FvtyV/file-00000000bc08720b9442e03fc47020a2.png',
      colorFrom: 'from-emerald-500',
      colorTo: 'to-teal-600',
      tag: 'HISTORIC',
      glow: 'rgba(16, 185, 129, 0.4)'
    },
    {
      id: 'quiz' as GameState,
      title: 'Verse Knowledge Quiz',
      subtitle: 'CRYPTO IQ CHALLENGE',
      desc: 'Test your blockchain knowledge and score ecosystem bonuses.',
      logoUrl: 'https://i.ibb.co.com/DPxxnS6F/file-00000000fdd071fa8b2edad69edccb1f.png',
      colorFrom: 'from-indigo-600',
      colorTo: 'to-purple-600',
      tag: 'BRAIN INTEL',
      glow: 'rgba(99, 102, 241, 0.4)'
    },
    {
      id: 'ecosystemBook' as GameState,
      title: 'Verse Ecosystem book',
      subtitle: 'DECENTRALIZATION ARCHIVE',
      desc: 'Academic chapters on decentralized networks, nodes, and ecosystem scale.',
      logoUrl: 'https://cdn-icons-png.flaticon.com/512/2232/2232688.png',
      colorFrom: 'from-amber-500',
      colorTo: 'to-amber-600',
      tag: 'ACADEMY',
      glow: 'rgba(245, 158, 11, 0.4)'
    },
    {
      id: 'cryptoEncyclopedia' as GameState,
      title: 'Crypto Encyclopedia',
      subtitle: 'WIKIPEDIA DICTIONARY',
      desc: 'Easy and detailed Web3 dictionary and essential FAQ archive.',
      logoUrl: 'https://i.ibb.co.com/tpLLKjSG/IMG-20260603-145948.png',
      colorFrom: 'from-cyan-400',
      colorTo: 'to-indigo-500',
      tag: 'ENCYCLOPEDIA',
      glow: 'rgba(34, 211, 238, 0.4)'
    },
    {
      id: 'verseInteractiveHub' as GameState,
      title: 'VERSE INTERACTIVE HUB',
      subtitle: 'INTERACTIVE COMMUNITY HUB',
      desc: 'Explore real-time decentralized simulations, charts, and ecosystem growth.',
      logoUrl: 'https://i.ibb.co.com/DPxxnS6F/file-00000000fdd071fa8b2edad69edccb1f.png',
      colorFrom: 'from-purple-600',
      colorTo: 'to-pink-600',
      tag: 'INTERACTIVE',
      glow: 'rgba(168, 85, 247, 0.4)'
    },
    {
      id: 'ourVerseCommunity' as GameState,
      title: 'Our Verse Community',
      subtitle: 'COMMUNITY GATEWAY',
      desc: 'Direct gateway to the Verse network and official collaborative community nodes.',
      logoUrl: 'https://i.ibb.co.com/cSX4SpFC/file-00000000fdd071fa8b2edad69edccb1f.png',
      colorFrom: 'from-yellow-400',
      colorTo: 'to-amber-500',
      tag: 'GATEWAY',
      glow: 'rgba(234, 179, 8, 0.4)'
    },
    {
      id: 'verseCommunityHub' as GameState,
      title: 'Our TG Bitcoin.com Wallet Community',
      subtitle: 'GLOBAL DECENTRALIZED COLLECTIVE',
      desc: 'Explore and join our official global community. Access 26 detailed interactive Telegram topics!',
      logoUrl: 'https://i.ibb.co.com/bRMwqvJz/IMG-20260530-154814.jpg',
      colorFrom: 'from-amber-500',
      colorTo: 'to-[#8b5e3c]',
      tag: 'COMMUNITY',
      glow: 'rgba(230, 130, 20, 0.4)'
    },
    {
      id: 'ecosystemActivityLog' as GameState,
      title: 'Ecosystem Activity Log',
      subtitle: 'LIVE TELEMETRY STREAMS',
      desc: 'Real-time transaction tracking, active validator node statuses and logs.',
      logoUrl: 'https://i.ibb.co.com/DPxxnS6F/file-00000000fdd071fa8b2edad69edccb1f.png',
      colorFrom: 'from-blue-600',
      colorTo: 'to-teal-500',
      tag: 'LIVE OPERATION',
      glow: 'rgba(37, 99, 235, 0.4)'
    },
    {
      id: 'home' as GameState,
      title: 'Home Dashboard',
      subtitle: 'OVERVIEW CENTER',
      desc: 'Return to the master overview, daily clickers, and community portal logs.',
      logoUrl: 'https://i.ibb.co.com/gbFvzHdb/file-00000000fdd071fa8b2edad69edccb1f.png',
      colorFrom: 'from-gray-700',
      colorTo: 'to-slate-800',
      tag: 'DASHBOARD',
      glow: 'rgba(100, 116, 139, 0.4)'
    }
  ];

  const handleTopicNavigation = (targetState: GameState, topicName: string) => {
    setNavigateTargetState(targetState);
    setNavigatingTopicName(topicName);
    setIsNavigatingTopic(true);
    setTopicLoadingProgress(0);

    let progressVal = 0;
    const interval = setInterval(() => {
      progressVal += 10;
      setTopicLoadingProgress(Math.min(progressVal, 100));
      if (progressVal >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsNavigatingTopic(false);
          
          if (targetState === 'cryptoHistory') {
            window.location.href = 'https://crypto-founder-history.vercel.app';
          } else if (targetState === 'cryptoEncyclopedia') {
            window.location.href = 'https://crypto-encyclopedia.vercel.app';
          } else if (targetState === 'verseInteractiveHub') {
            window.location.href = 'https://verse-interactive-hub.vercel.app';
          } else if (targetState === 'ourVerseCommunity' as GameState) {
            window.location.href = 'https://our-verse-community.vercel.app';
          } else if (targetState === 'bitcoinWallet') {
            window.location.href = 'https://bitcoin-com-wallet-inspired-demo.vercel.app';
          } else {
            setGameState(targetState);
            if (targetState === 'home') {
              setHomeSubState('features');
            }
          }
        }, 150);
      }
    }, 120);
  };

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
    <div className={`min-h-screen w-full font-sans selection:bg-[#c0a080] selection:text-white flex flex-col items-center transition-colors duration-300 ${displayMode === 'dark' ? 'bg-[#121214] text-gray-100' : 'bg-[#f8fafc] text-gray-900'}`}>

      {/* Dynamic 5-Color Blended Ambient Background Glows for Inner Web Pages (#3B82F6, #6366F1, #8B5CF6, #A855F7, #D946EF) */}
      {!(gameState === 'home' && homeSubState === 'welcome') && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
          {/* Blend of 5 high-end responsive ambient glowing blobs */}
          {/* Blue Fluid Glow (Top Left) */}
          <div className="absolute top-[-10vw] left-[-10vw] w-[45vw] h-[45vw] max-w-[550px] rounded-full bg-[#3B82F6]/10 dark:bg-[#3B82F6]/6 blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
          {/* Indigo Fluid Glow (Center Right) */}
          <div className="absolute top-[20%] right-[-10vw] w-[40vw] h-[40vw] max-w-[500px] rounded-full bg-[#6366F1]/10 dark:bg-[#6366F1]/5 blur-[110px] animate-pulse" style={{ animationDuration: '13s' }} />
          {/* Purple Fluid Glow (Bottom Left) */}
          <div className="absolute bottom-[10vw] left-[-5vw] w-[35vw] h-[35vw] max-w-[450px] rounded-full bg-[#8B5CF6]/9 dark:bg-[#8B5CF6]/5 blur-[100px] animate-pulse" style={{ animationDuration: '9s' }} />
          {/* Violet Fluid Glow (Bottom Right) */}
          <div className="absolute bottom-[-10vw] right-[-5vw] w-[40vw] h-[40vw] max-w-[500px] rounded-full bg-[#A855F7]/10 dark:bg-[#A855F7]/6 blur-[115px] animate-pulse" style={{ animationDuration: '12s' }} />
          {/* Pink/Magenta Fluid Glow (Center) */}
          <div className="absolute top-[35%] left-[25%] w-[35vw] h-[35vw] max-w-[420px] rounded-full bg-[#D946EF]/8 dark:bg-[#D946EF]/4 blur-[105px] animate-pulse" style={{ animationDuration: '15s' }} />
          
          {/* Subtle linear overlay to synthesize into a unified theme */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3B82F6]/2 via-[#8B5CF6]/2 to-[#D946EF]/3 opacity-70 dark:opacity-40" />
        </div>
      )}

      {/* PREMIUM TOPIC NAVIGATION LOADING OVERLAY WITH PALETTE (Mint Green, Aqua, Sky Blue, Royal Blue) */}
      <AnimatePresence>
        {isNavigatingTopic && (
          <motion.div
            key="topic-navigation-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10002] bg-slate-950/95 flex flex-col items-center justify-center p-6 text-white backdrop-blur-xl"
          >
            {/* Ambient gradients */}
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />

            <div className="max-w-md w-full text-center space-y-6 relative z-10 px-4">
              <span className="text-[10px] font-mono tracking-[0.3em] text-[#3cd070] font-black uppercase bg-[#3cd070]/10 px-3 py-1.5 rounded-full border border-[#3cd070]/20 animate-pulse">
                INITIALIZING SECURE PORTAL CONSOLE
              </span>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight text-white uppercase">
                  {navigatingTopicName}
                </h2>
                <p className="text-xs text-slate-450 font-mono">Syncing secure blocks, datasets and visual charts...</p>
              </div>

              {/* Glowing High-Tech Double Spinner */}
              <div className="relative w-24 h-24 mx-auto my-8">
                <div className="absolute inset-0 border-4 border-slate-900 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-blue-600 border-r-[#3cd070] rounded-full animate-spin" style={{ animationDuration: '1.2s' }}></div>
                <div className="absolute inset-[8px] border-4 border-t-cyan-400 border-l-teal-300 rounded-full animate-spin" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }}></div>
                <div className="absolute inset-[16px] border-2 border-t-sky-400 rounded-full animate-pulse"></div>
              </div>

              {/* High-Fidelity progress tracer */}
              <div className="space-y-2.5 max-w-xs mx-auto">
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-[#3cd070] via-cyan-400 via-sky-400 to-blue-600 transition-all duration-150 ease-out shadow-[0_0_15px_rgba(6,182,212,0.6)]"
                    style={{ width: `${topicLoadingProgress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-450 font-mono font-black uppercase tracking-wider">
                  <span className="animate-pulse">DECRYPTING PROTOCOL</span>
                  <span className="text-white">{Math.floor(topicLoadingProgress)}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
        ) : (
          <motion.div
            key="app-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-0 w-full flex flex-col items-center"
          >
            {/* Navigation Header - Only shown inside gameplay/features screens, completely hidden on the welcome page */}
            {!(gameState === 'home' && homeSubState === 'welcome') && (
              <header className={`border-b mt-4 mb-2 mx-auto max-w-4xl w-full rounded-2xl shadow-[0_3px_20px_rgba(139,94,60,0.08)] sticky top-2 z-[99] backdrop-blur-md transition-colors ${
                displayMode === 'dark' ? 'border-[#2C2C2E] bg-black/95' : 'border-[#8b5e3c]/15 bg-white/95'
              }`}>
                <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between w-full relative">
                  
                  {/* Top-Left Corner Premium Logo and Brand Name side-by-side on a single line */}
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => setShowSettings(true)}
                      className={`active:scale-95 transition-all duration-150 px-2.5 py-1.5 rounded-xl border font-black text-sm md:text-base select-none flex-shrink-0 cursor-pointer ${
                        displayMode === 'dark' ? 'text-sky-400 bg-sky-500/5 border-sky-500/10 hover:bg-sky-500/15' : 'text-[#8b5e3c] bg-amber-500/5 border-[#8b5e3c]/10 hover:bg-amber-500/15'
                      }`}
                    >
                      ( ☰ )
                    </button>
                    <img
                      src="https://i.ibb.co.com/gbFvzHdb/file-00000000fdd071fa8b2edad69edccb1f.png"
                      alt="Bitcoin.com logo"
                      className="w-10 h-10 object-cover rounded-xl border border-[#8b5e3c]/30 shadow-md transform hover:scale-105 transition-transform duration-300 flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <h1 className="text-xs sm:text-sm md:text-base font-black tracking-tight uppercase leading-none select-none min-w-0 truncate bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent">
                      Bitcoin Wallet &amp; Verse Learning Hub
                    </h1>
                  </div>

                  {/* Navigation Header Action Button */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {gameState !== 'home' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setGameState('home')}
                        className={`relative px-4 py-2 rounded-xl border transition-all duration-200 flex items-center gap-1.5 font-mono font-black text-xs cursor-pointer select-none ${
                          displayMode === 'dark' ? 'border-[#2C2C2E] bg-black text-white hover:bg-[#2C2C2E]' : 'border-[#8b5e3c]/25 bg-amber-500/5 text-[#8b5e3c] hover:text-white hover:bg-[#8b5e3c]'
                        }`}
                      >
                        <span>🏠 BACK HOME</span>
                      </motion.button>
                    )}
                  </div>

                </div>
              </header>
            )}

            <main className="max-w-4xl w-full mx-auto px-6 py-8">

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
                          className="w-full max-w-3xl mx-auto flex flex-col items-center relative"
                        >
                          {/* Elegant high-quality professional 5-color blend ambient background glows (#3B82F6, #6366F1, #8B5CF6, #A855F7, #D946EF) */}
                          <div className="absolute inset-x-0 -top-16 -bottom-32 overflow-hidden pointer-events-none -z-10 select-none">
                            {/* Radial Glow Blob 1 - Top Left */}
                            <div className="absolute top-0 -left-12 w-80 h-80 rounded-full bg-gradient-to-tr from-[#3B82F6]/10 via-[#6366F1]/15 to-[#8B5CF6]/10 blur-[90px] animate-pulse" style={{ animationDuration: '9s' }} />
                            {/* Radial Glow Blob 2 - Center Right */}
                            <div className="absolute top-1/4 -right-16 w-88 h-88 rounded-full bg-gradient-to-br from-[#8B5CF6]/10 via-[#A855F7]/12 to-[#D946EF]/10 blur-[100px] animate-pulse" style={{ animationDuration: '11s' }} />
                            {/* Radial Glow Blob 3 - Bottom Left */}
                            <div className="absolute bottom-12 left-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-[#3B82F6]/8 via-[#8B5CF6]/10 to-[#D946EF]/12 blur-[110px] animate-pulse" style={{ animationDuration: '13s' }} />
                          </div>

                               {/* Top-Left Logo Block (Ujjol/Spinning/Shining style - V maintains static upright position) */}
                          <div className="w-full flex items-center justify-start gap-2 px-4 mb-4 select-none">
                            <div className="relative flex items-center justify-center w-12 h-12">
                              {/* Pulse-glow behind logo */}
                              <div className="absolute w-12 h-12 rounded-full bg-rose-500/25 blur-md animate-pulse pointer-events-none" />
                              
                              {/* Glowing spinning ring (the colorful gradient background rotates continuously) */}
                              <motion.div
                                className="absolute inset-0 rounded-full p-[2.5px] bg-gradient-to-tr from-rose-500 via-amber-400 to-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                                animate={{ rotate: 360 }}
                                transition={{ ease: "linear", duration: 6, repeat: Infinity }}
                              />
                              
                              {/* Main Logo Container (Static, doesn't rotate, maintaining V perfectly upright) */}
                              <div className="absolute w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden z-10 shadow-inner">
                                {/* Sweeping bright shimmer effect */}
                                <motion.div 
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-full"
                                  animate={{ x: ["100%", "-100%"] }}
                                  transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                                />
                                <img
                                  src="https://i.ibb.co.com/cSX4SpFC/file-00000000fdd071fa8b2edad69edccb1f.png"
                                  alt="Verse logo"
                                  className="w-7 h-7 object-contain relative z-20"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            </div>
                            
                            {/* Branded "Verse" title */}
                            <span className="text-xl font-black font-sans tracking-widest bg-gradient-to-r from-amber-500 via-[#8b5e3c] to-amber-600 bg-clip-text text-transparent uppercase drop-shadow-sm">
                              Verse
                            </span>
                          </div>

                          {/* Welcome greetings block (NO border, entirely transparent styling, absolute custom headings) */}
                          <section className="text-center w-full select-none flex flex-col items-center mt-6">
                            <h2 className="leading-tight text-center flex flex-col items-center select-none font-sans space-y-3">
                              <span className="text-2xl sm:text-3xl uppercase tracking-[0.25em] font-black bg-[linear-gradient(to_right,#3B82F6,#6366F1,#8B5CF6,#A855F7,#D946EF)] bg-clip-text text-transparent filter drop-shadow-[0_1px_4px_rgba(139,92,246,0.15)]">
                                WELCOME
                              </span>
                              <span className="text-sm sm:text-base font-black uppercase tracking-[0.3em] bg-[linear-gradient(to_right,#3B82F6,#6366F1,#8B5CF6,#A855F7,#D946EF)] bg-clip-text text-transparent filter drop-shadow-[0_1px_4px_rgba(139,92,246,0.15)]">
                                TO
                              </span>
                              <span className="text-2xl sm:text-3xl md:text-4xl font-black bg-[linear-gradient(to_right,#3B82F6,#6366F1,#8B5CF6,#A855F7,#D946EF)] bg-clip-text text-transparent uppercase tracking-tight filter drop-shadow-[0_2px_10px_rgba(139,92,246,0.25)] leading-tight max-w-2xl px-4">
                                BITCOIN WALLET &amp; VERSE LEARNING HUB
                              </span>
                            </h2>

                            {/* Action GET STARTED Button styled beautifully with medium size, green color border and 5-color blended text inside */}
                            <div className="pt-10 pb-2 w-full flex justify-center">
                              <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(16, 185, 129, 0.40)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setHomeSubState('features')}
                                className="px-9 py-4 text-base sm:text-lg bg-transparent font-black tracking-widest uppercase rounded-2xl border-[3px] border-emerald-500 dark:border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:bg-emerald-500/10 transition-all duration-300 cursor-pointer select-none"
                              >
                                <span className="bg-[linear-gradient(to_right,#3B82F6,#6366F1,#8B5CF6,#A855F7,#D946EF)] bg-clip-text text-transparent">
                                  {t("Get Started", "শুরু করুন")}
                                </span>
                              </motion.button>
                            </div>
                          </section>

                          {/* Beautiful Description Points in wide layout, separated by generous 1.2-inch distance (mt-20 sm:mt-24), NO outer border container */}
                          <div className="w-full mt-24 sm:mt-28 space-y-6">
                            <div className="flex items-center gap-3 pb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
                              <div className="w-3 h-6 rounded-full" style={{ backgroundImage: 'linear-gradient(to bottom, #3B82F6, #8B5CF6, #D946EF)' }} />
                              <h3 className="text-lg sm:text-xl font-black font-sans tracking-tight bg-clip-text text-transparent uppercase" style={{ backgroundImage: 'linear-gradient(to right, #3B82F6, #6366F1, #8B5CF6, #A855F7, #D946EF)' }}>
                                {t("HOW IT WORKS", "HOW IT WORKS")}
                              </h3>
                            </div>

                            <div className="grid grid-cols-1 gap-5">
                              {/* Point 1 */}
                              <div className={`border rounded-2xl p-5 sm:p-6 space-y-3 transition-all shadow-sm relative overflow-hidden group ${
                                displayMode === 'dark' ? 'bg-black/40 border-[#2C2C2E] hover:border-[#8B5CF6]/40' : 'bg-white border-slate-200 hover:border-[#8B5CF6]/30'
                              }`}>
                                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundImage: 'linear-gradient(to right, #3B82F6, #6366F1, #8B5CF6, #A855F7, #D946EF)' }} />
                                <h4 className="text-sm sm:text-base font-black font-sans tracking-tight uppercase bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #3B82F6, #6366F1, #8B5CF6, #A855F7, #D946EF)' }}>
                                  (1) About this website
                                </h4>
                                <p className={`text-xs sm:text-sm font-semibold leading-relaxed transition-colors ${
                                  displayMode === 'dark' ? 'text-gray-300' : 'text-slate-700'
                                }`}>
                                  This website has been created for <span className="text-[#3B82F6] font-bold">educational and informational</span> purposes only, so that users can easily learn and understand Bitcoin.com Wallet's various features, usage methods and cryptocurrency ecosystem. Efforts are made to keep market prices and other information displayed here as accurate as possible.
                                </p>
                              </div>

                              {/* Point 2 */}
                              <div className={`border rounded-2xl p-5 sm:p-6 space-y-3 transition-all shadow-sm relative overflow-hidden group ${
                                displayMode === 'dark' ? 'bg-black/40 border-[#2C2C2E] hover:border-[#8B5CF6]/40' : 'bg-white border-slate-200 hover:border-[#8B5CF6]/30'
                              }`}>
                                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundImage: 'linear-gradient(to right, #3B82F6, #6366F1, #8B5CF6, #A855F7, #D946EF)' }} />
                                <h4 className="text-sm sm:text-base font-black font-sans tracking-tight uppercase bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #3B82F6, #6366F1, #8B5CF6, #A855F7, #D946EF)' }}>
                                  (2) Educational and informational platforms
                                </h4>
                                <p className={`text-xs sm:text-sm font-semibold leading-relaxed transition-colors ${
                                  displayMode === 'dark' ? 'text-gray-300' : 'text-slate-700'
                                }`}>
                                  This website is <span className="text-[#D946EF] font-bold">not the official website or app</span> of Bitcoin.com Wallet and has no direct affiliation or endorsement with Bitcoin.com. The various features, interfaces and information displayed here are presented only for the convenience of the users, so that they can easily analyze and understand the various topics.
                                </p>
                                <div className={`text-[11px] font-black font-mono tracking-wider px-3 py-1.5 rounded-xl border inline-block text-slate-800 dark:text-slate-100 border-[#6366F1]/20 bg-slate-500/5`}>
                                  Demo ➔ Educational ➔ Guide ➔ Information Hub
                                </div>
                              </div>

                              {/* Point 3 */}
                              <div className={`border rounded-2xl p-5 sm:p-6 space-y-3 transition-all shadow-sm relative overflow-hidden group ${
                                displayMode === 'dark' ? 'bg-black/40 border-[#2C2C2E] hover:border-[#8B5CF6]/40' : 'bg-white border-slate-200 hover:border-[#8B5CF6]/30'
                              }`}>
                                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundImage: 'linear-gradient(to right, #3B82F6, #6366F1, #8B5CF6, #A855F7, #D946EF)' }} />
                                <h4 className="text-sm sm:text-base font-black font-sans tracking-tight uppercase bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #3B82F6, #6366F1, #8B5CF6, #A855F7, #D946EF)' }}>
                                  (3) For official app usage
                                </h4>
                                <p className={`text-xs sm:text-sm font-semibold leading-relaxed transition-colors ${
                                  displayMode === 'dark' ? 'text-gray-300' : 'text-slate-700'
                                }`}>
                                  Please use the official Bitcoin.com platform to download and use the official Bitcoin.com Wallet app. This website is created for informational, educational and user awareness purposes only. The various information, instructions and topics provided here will help users to learn and understand Bitcoin.com and the <span className="text-[#8B5CF6] font-bold">VERSE Ecosystem</span> in depth.
                                </p>
                                <div className="pt-1.5">
                                  <a 
                                    href="https://wallet.bitcoin.com/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-[#007AFF] hover:bg-blue-600 text-white text-xs font-black rounded-xl shadow-md transition-all active:scale-95 uppercase"
                                  >
                                    Download here : wallet.bitcoin.com
                                  </a>
                                </div>
                              </div>

                              {/* Point 4 */}
                              <div className={`border rounded-2xl p-5 sm:p-6 space-y-3 transition-all shadow-sm relative overflow-hidden group ${
                                displayMode === 'dark' ? 'bg-black/40 border-[#2C2C2E] hover:border-[#8B5CF6]/40' : 'bg-white border-slate-200 hover:border-[#8B5CF6]/30'
                              }`}>
                                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundImage: 'linear-gradient(to right, #3B82F6, #6366F1, #8B5CF6, #A855F7, #D946EF)' }} />
                                <h4 className="text-sm sm:text-base font-black font-sans tracking-tight uppercase bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #3B82F6, #6366F1, #8B5CF6, #A855F7, #D946EF)' }}>
                                  (4) Learn about ecosystems
                                </h4>
                                <p className={`text-xs sm:text-sm font-semibold leading-relaxed transition-colors ${
                                  displayMode === 'dark' ? 'text-gray-300' : 'text-slate-700'
                                }`}>
                                  <span className="text-[#6366F1] font-bold dark:text-sky-300">Bitcoin.com Ecosystem, Wallet Features, Market Information</span> and other important topics are discussed in detail in various sections of this website. Through this, users can learn, understand and analyze the entire ecosystem with real-world experience.
                                </p>
                              </div>

                              {/* Point 5 */}
                              <div className={`border rounded-2xl p-5 sm:p-6 space-y-3 transition-all shadow-sm relative overflow-hidden group ${
                                displayMode === 'dark' ? 'bg-black/40 border-[#2C2C2E] hover:border-[#8B5CF6]/40' : 'bg-white border-slate-200 hover:border-[#8B5CF6]/30'
                              }`}>
                                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundImage: 'linear-gradient(to right, #3B82F6, #6366F1, #8B5CF6, #A855F7, #D946EF)' }} />
                                <h4 className="text-sm sm:text-base font-black font-sans tracking-tight uppercase bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #3B82F6, #6366F1, #8B5CF6, #A855F7, #D946EF)' }}>
                                  (5) VERSE AND RELATED SUBJECTS
                                </h4>
                                <p className={`text-xs sm:text-sm font-semibold leading-relaxed transition-colors ${
                                  displayMode === 'dark' ? 'text-gray-300' : 'text-slate-700'
                                }`}>
                                  Also, various topics related to <span className="text-[#A855F7] font-bold">VERSE Token</span> and its various uses, utilities, community and ecosystem are discussed here. This information will help users to better know and understand the VERSE Ecosystem.
                                </p>
                              </div>

                              {/* Point 6 */}
                              <div className={`border rounded-2xl p-5 sm:p-6 space-y-3 transition-all shadow-sm relative overflow-hidden group ${
                                displayMode === 'dark' ? 'bg-black/40 border-[#2C2C2E] hover:border-[#8B5CF6]/40' : 'bg-white border-slate-200 hover:border-[#8B5CF6]/30'
                              }`}>
                                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundImage: 'linear-gradient(to right, #3B82F6, #6366F1, #8B5CF6, #A855F7, #D946EF)' }} />
                                <h4 className="text-sm sm:text-base font-black font-sans tracking-tight uppercase bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #3B82F6, #6366F1, #8B5CF6, #A855F7, #D946EF)' }}>
                                  (6) Especially important for new users
                                </h4>
                                <p className={`text-xs sm:text-sm font-semibold leading-relaxed transition-colors ${
                                  displayMode === 'dark' ? 'text-gray-300' : 'text-slate-700'
                                }`}>
                                  This platform is <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] font-bold">very important for those who are new</span> to Cryptocurrency, Blockchain, Bitcoin.com Ecosystem or VERSE and don't know much about these networks and technologies. An attempt has been made here to explain various topics in simple language, so that even new users can gradually gain an understanding of the entire ecosystem.
                                </p>
                              </div>
                            </div>
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
                          {/* TOPICS / PORTALS WEB GRID */}
                          <div className="space-y-6 pt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                              {navigationTopics.filter(topic => topic.id !== 'home').map((topic) => {
                                return (
                                  <motion.button
                                    key={topic.id}
                                    whileHover={{ 
                                      y: -6,
                                      boxShadow: '0 20px 30px -5px rgba(99,102,241,0.15), 0 10px 15px -5px rgba(139,92,246,0.1)'
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleTopicNavigation(topic.id, topic.title)}
                                    className={`flex flex-col text-left p-6 rounded-[2rem] transition-all duration-300 group cursor-pointer relative overflow-hidden shadow-md ${
                                      displayMode === 'dark' 
                                        ? 'bg-[#1C1C1E] hover:bg-[#2C2C2E]/40 border border-[#2C2C2E] hover:border-[#8B5CF6]/50 shadow-black/30' 
                                        : 'bg-white hover:bg-slate-50/50 border border-slate-200/60 hover:border-[#8B5CF6]/40 shadow-slate-900/[0.02]'
                                    }`}
                                  >
                                    {/* Top Horizontal Accent Line with the 5-Color Gradient */}
                                    <div className="absolute top-0 left-0 right-0 h-[3px] opacity-70 group-hover:opacity-100 transition-opacity" style={{ backgroundImage: 'linear-gradient(to right, #3B82F6, #6366F1, #8B5CF6, #A855F7, #D946EF)' }} />

                                    {/* Accent background glow based on the topic theme */}
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#8B5CF6]/5 to-[#D946EF]/5 rounded-full blur-2xl pointer-events-none" />

                                    {/* Top Metadata Row */}
                                    <div className="flex items-center justify-between w-full mb-5 relative z-10">
                                      {/* Icon Container with subtle border */}
                                      <div className={`w-12 h-12 rounded-2xl overflow-hidden border p-0.5 flex-shrink-0 shadow-inner group-hover:scale-105 transition-all duration-300 ${
                                        displayMode === 'dark' ? 'border-[#2C2C2E] bg-black' : 'border-[#6366F1]/10 bg-white'
                                      }`}>
                                        <img
                                          src={topic.logoUrl}
                                          alt={topic.title}
                                          className="w-full h-full object-cover rounded-xl"
                                          referrerPolicy="no-referrer"
                                        />
                                      </div>

                                      {/* Tag Label */}
                                      <span className={`text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded-full border transition-colors ${
                                        displayMode === 'dark' 
                                          ? 'text-[#a5ccf9] bg-[#3B82F6]/10 border-[#3B82F6]/30' 
                                          : 'text-[#6366F1] bg-[#6366F1]/5 border-[#6366F1]/15'
                                      }`}>
                                        {topic.tag}
                                      </span>
                                    </div>

                                    {/* Text Body */}
                                    <div className="space-y-1.5 flex-grow relative z-10">
                                      <span className="block text-[10px] font-mono font-black uppercase tracking-widest leading-none bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #3B82F6, #6366F1, #8B5CF6, #A855F7, #D946EF)' }}>
                                        {topic.subtitle}
                                      </span>
                                      <h3 className={`text-base font-black tracking-tight group-hover:text-[#6366F1] dark:group-hover:text-[#d946ef] transition-colors ${
                                        displayMode === 'dark' ? 'text-white' : 'text-slate-800'
                                      }`}>
                                        {topic.title}
                                      </h3>
                                      <p className={`text-xs font-semibold leading-relaxed font-sans line-clamp-3 transition-colors ${
                                        displayMode === 'dark' ? 'text-gray-300' : 'text-slate-500'
                                      }`}>
                                        {topic.desc}
                                      </p>
                                    </div>

                                    {/* Call to action arrow footer */}
                                    <div className={`mt-5 pt-3 border-t flex items-center justify-between text-[11px] font-mono font-black uppercase tracking-wider w-full relative z-10 ${
                                      displayMode === 'dark' ? 'border-[#2C2C2E]' : 'border-slate-100'
                                    }`}>
                                      <span className="bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent">ENTER PORTAL</span>
                                      <span className="text-[#8B5CF6] dark:text-[#D946EF] transform group-hover:translate-x-1.5 transition-transform duration-300">➜</span>
                                    </div>
                                  </motion.button>
                                );
                              })}
                            </div>
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

          {gameState === 'bitcoinWallet' && (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-600 font-bold font-sans">Redirecting to Bitcoin.com Wallet Demo...</p>
              <button 
                onClick={() => setGameState('home')} 
                className="mt-4 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#8b5e3c] font-black rounded-xl text-xs uppercase"
              >
                Back to Dashboard
              </button>
            </div>
          )}

          {gameState === 'ecosystemBook' && (
            <VerseEcosystemBook 
              onBack={() => setGameState('home')} 
              onEarnCoins={(amount) => handleEarn(amount, 'book_learning')}
            />
          )}

          {gameState === 'verseCommunityHub' && (
            <div className="space-y-8 animate-fade-in">
              <div className="w-full flex justify-between items-center bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                <button 
                  onClick={() => setGameState('home')} 
                  className="p-2.5 hover:bg-gray-50 rounded-xl transition-all flex items-center gap-2 text-[#8b5e3c] font-black uppercase text-xs tracking-wider cursor-pointer border border-transparent hover:border-gray-100"
                >
                  <ArrowLeft className="w-5 h-5" /> Back Home
                </button>
                <span className="font-mono text-xs uppercase tracking-widest text-[#8b5e3c] font-black">Telegram Portal Connect</span>
              </div>
              <TelegramCommunityHub />
            </div>
          )}

          {gameState === 'ecosystemActivityLog' && (
            <EcosystemActivityLog 
              onBack={() => setGameState('home')} 
            />
          )}


        </AnimatePresence>
      </main>

      {(gameState === 'home' && homeSubState === 'features') && (
        <>
          {/* LARGE CENTERED BOTTOM LOGO */}
          <div className="flex flex-col items-center justify-center py-10 pb-8 text-center w-full relative z-10 select-none">
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

          {/* EDUCATIONAL FOOTER SUMMARY CARD WITH ENGLISH/BENGALI TRANSLATION */}
          <div className="max-w-4xl mx-auto px-6 mb-16 relative z-10">
            <div className={`border rounded-[2.5rem] p-8 sm:p-10 shadow-xl relative overflow-hidden transition-all hover:shadow-2xl ${
              displayMode === 'dark' ? 'bg-[#1C1C1E] border-[#2C2C2E]' : 'bg-white border-gray-100'
            }`}>
              {/* Background gradient embellishment */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-500/5 to-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 space-y-6">
                {/* Header Row */}
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 ${
                  displayMode === 'dark' ? 'border-[#2C2C2E]' : 'border-gray-50'
                }`}>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 bg-clip-text text-transparent uppercase tracking-tight">
                      {footerDescLang === 'en' ? 'What can you learn from our website?' : 'আমাদের ওয়েবসাইট থেকে আপনি কী কী শিখতে পারবেন?'}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-1 uppercase tracking-wider">
                      {footerDescLang === 'en' ? 'Interactive Learning Platform Guide' : 'ইন্টারেক্টিভ লার্নিং প্ল্যাটফর্ম সহায়িকা'}
                    </p>
                  </div>
                  
                  {/* Language Switcher Toggle */}
                  <div className={`flex items-center gap-1.5 self-start sm:self-auto p-1.5 rounded-2xl border ${
                    displayMode === 'dark' ? 'bg-black/60 border-[#2C2C2E]' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <button
                      onClick={() => setFooterDescLang('en')}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        footerDescLang === 'en'
                          ? (displayMode === 'dark' ? 'bg-[#2C2C2E] text-[#007AFF] shadow-sm border border-[#2C2C2E]' : 'bg-white text-teal-600 shadow-sm border border-gray-100')
                          : (displayMode === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')
                      }`}
                    >
                      🇬🇧 English
                    </button>
                    <button
                      onClick={() => setFooterDescLang('bn')}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        footerDescLang === 'bn'
                          ? (displayMode === 'dark' ? 'bg-[#2C2C2E] text-[#007AFF] shadow-sm border border-[#2C2C2E]' : 'bg-white text-teal-600 shadow-sm border border-gray-100')
                          : (displayMode === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')
                      }`}
                    >
                      🇧🇩 বাংলা
                    </button>
                  </div>
                </div>

                {/* Spaced Out Text Content ("একটু ফাঁকা ফাঁকা করে লেখবা") */}
                <div className={`text-sm sm:text-base leading-relaxed space-y-6 font-medium transition-all duration-300 ${
                  displayMode === 'dark' ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  {!footerDescExpanded ? (
                    // Show first paragraph as summary
                    <p className="first-letter:text-3xl first-letter:font-black first-letter:text-teal-600 first-letter:mr-2 first-letter:float-left">
                      {footerDescLang === 'en' ? FOOTER_LEARN_EN[0] : FOOTER_LEARN_BN[0]}
                    </p>
                  ) : (
                    // Show everything beautifully mapped with gap
                    (footerDescLang === 'en' ? FOOTER_LEARN_EN : FOOTER_LEARN_BN).map((para, pIdx) => {
                      // Check if it contains bullet points to render nicely as lists
                      if (para.includes('•')) {
                        const lines = para.split('\n');
                        const listTitle = lines[0];
                        const bullets = lines.slice(1);
                        return (
                          <div key={pIdx} className={`space-y-3 p-6 rounded-2xl my-4 border ${
                            displayMode === 'dark' ? 'bg-teal-950/15 border-teal-500/20 text-gray-300' : 'bg-teal-50/20 border-teal-500/5 text-slate-600'
                          }`}>
                            <p className={`font-bold ${displayMode === 'dark' ? 'text-teal-400' : 'text-slate-800'}`}>{listTitle}</p>
                            <ul className={`space-y-2 pl-4 sm:pl-6 ${displayMode === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                              {bullets.map((b, bIdx) => (
                                <li key={bIdx} className="flex items-start gap-2 text-sm sm:text-base">
                                  <span className="text-teal-500 font-bold mt-0.5">•</span>
                                  <span>{b.replace('•', '').trim()}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      }
                      return (
                        <p key={pIdx} className={`${pIdx === 0 ? 'first-letter:text-3xl first-letter:font-black first-letter:text-teal-600 first-letter:mr-2 first-letter:float-left' : ''}`}>
                          {para}
                        </p>
                      );
                    })
                  )}
                </div>

                {/* Detail Toggle Action Buttons */}
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setFooterDescExpanded(!footerDescExpanded)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 active:scale-95 transition-all text-sm cursor-pointer"
                  >
                    {footerDescExpanded ? (
                      <>
                        <span>{footerDescLang === 'en' ? 'Show Less' : 'কম বিস্তারিত দেখান'}</span>
                        <ChevronUp className="w-4 h-4 text-white/90" />
                      </>
                    ) : (
                      <>
                        <span>{footerDescLang === 'en' ? 'More Details' : 'আরও বিস্তারিত'}</span>
                        <ChevronDown className="w-4 h-4 text-white/90" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
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

      {/* FULL DISPLAY OVERLAY PAGE FOR SETTINGS */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            key="ios-style-settings-view"
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 240 }}
            className={`fixed inset-0 z-[10001] flex flex-col font-sans select-none overflow-y-auto transition-colors duration-300 ${
              displayMode === 'dark' ? 'bg-[#000000] text-white' : 'bg-[#F2F2F7] text-black'
            }`}
          >
            {/* Header Area styled like iOS Settings */}
            <div className={`w-full border-b px-4 py-3.5 flex items-center justify-between sticky top-0 z-10 flex-shrink-0 transition-colors duration-300 ${
              displayMode === 'dark' ? 'bg-[#1C1C1E] border-[#2C2C2E]/85' : 'bg-white border-gray-200/80'
            }`}>
              <button
                onClick={() => {
                  if (settingsSubView !== 'main') {
                    setSettingsSubView('main');
                  } else {
                    setShowSettings(false);
                  }
                }}
                className="flex items-center gap-1.5 text-[#007AFF] hover:opacity-75 transition-all text-[17px] font-medium cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
                <span>{t("Back", "পিছনে")}</span>
              </button>
              
              <h2 className={`text-[17px] font-bold absolute left-1/2 -translate-x-1/2 transition-colors duration-300 ${
                displayMode === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {settingsSubView === 'main' && t("Settings", "সেটিংস")}
                {settingsSubView === 'download' && t("Download Wallet", "ওয়ালেট ডাউনলোড")}
                {settingsSubView === 'join' && t("Join Verse", "ভার্স কম্যুনিটি")}
                {settingsSubView === 'language' && t("Language", "ভাষা")}
                {settingsSubView === 'display' && t("Display", "প্রদর্শন")}
                {settingsSubView === 'about' && t("About Community", "কমিউনিটি সম্পর্কে")}
                {settingsSubView === 'contact' && t("Contact", "যোগাযোগ")}
                {settingsSubView === 'wallet_about' && t("About Wallet", "ওয়ালেট সম্পর্কে")}
              </h2>

              {/* Empty placeholder on the right to keep center-aligned title balanced */}
              <div className="w-16" />
            </div>

            {/* MAIN LIST BODY AREA */}
            <div className="max-w-xl w-full mx-auto px-4 py-6 space-y-6 flex-1">
              
              {/* SUBVIEW 1: MAIN MENU */}
              {settingsSubView === 'main' && (
                <div className="space-y-6">
                  {/* GROUP 1 */}
                  <div className={`rounded-[14px] border overflow-hidden shadow-sm transition-colors duration-300 ${
                    displayMode === 'dark' ? 'bg-[#1C1C1E] border-[#2C2C2E]/80' : 'bg-white border-gray-200/60'
                  }`}>
                    
                    {/* Row 1: Download bitcoin.com wallet */}
                    <div 
                      onClick={() => setSettingsSubView('download')}
                      className={`px-4 py-3.5 flex items-center justify-between border-b transition-all cursor-pointer ${
                        displayMode === 'dark' 
                          ? 'border-[#2C2C2E]/50 hover:bg-[#2C2C2E]/50 active:bg-[#2C2C2E]' 
                          : 'border-gray-105 hover:bg-slate-50 active:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7.5 h-7.5 bg-[#007AFF] rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                          <Download className="w-4.5 h-4.5 stroke-[2.5]" />
                        </div>
                        <span className={`text-[17px] font-normal transition-colors duration-300 ${
                          displayMode === 'dark' ? 'text-gray-200' : 'text-gray-900'
                        }`}>
                          {t("Download bitcoin.com wallet", "bitcoin.com ওয়ালেট ডাউনলোড করুন")}
                        </span>
                      </div>
                      <ChevronRight className={`w-5 h-5 ${displayMode === 'dark' ? 'text-[#48484A]' : 'text-[#C7C7CC]'}`} />
                    </div>

                    {/* Row 2: Join Verse Community */}
                    <div 
                      onClick={() => setSettingsSubView('join')}
                      className={`px-4 py-3.5 flex items-center justify-between border-b transition-all cursor-pointer ${
                        displayMode === 'dark' 
                          ? 'border-[#2C2C2E]/50 hover:bg-[#2C2C2E]/50 active:bg-[#2C2C2E]' 
                          : 'border-gray-105 hover:bg-slate-50 active:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7.5 h-7.5 bg-[#5856D6] rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                          <Users className="w-4.5 h-4.5 stroke-[2.5]" />
                        </div>
                        <span className={`text-[17px] font-normal transition-colors duration-300 ${
                          displayMode === 'dark' ? 'text-gray-200' : 'text-gray-900'
                        }`}>
                          {t("Join Verse Community", "ভার্স কমিউনিটিতে যোগ দিন")}
                        </span>
                      </div>
                      <ChevronRight className={`w-5 h-5 ${displayMode === 'dark' ? 'text-[#48484A]' : 'text-[#C7C7CC]'}`} />
                    </div>

                    {/* Row 3: Language */}
                    <div 
                      onClick={() => setSettingsSubView('language')}
                      className={`px-4 py-3.5 flex items-center justify-between border-b transition-all cursor-pointer ${
                        displayMode === 'dark' 
                          ? 'border-[#2C2C2E]/50 hover:bg-[#2C2C2E]/50 active:bg-[#2C2C2E]' 
                          : 'border-gray-105 hover:bg-slate-50 active:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7.5 h-7.5 bg-[#30B0C7] rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                          <Globe className="w-4.5 h-4.5 stroke-[2.5]" />
                        </div>
                        <span className={`text-[17px] font-normal transition-colors duration-300 ${
                          displayMode === 'dark' ? 'text-gray-200' : 'text-gray-900'
                        }`}>
                          {t("Language", "ভাষা")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[14px] text-gray-400 font-medium">
                          {appLanguage === 'bn' ? 'বাংলা' : 'English'}
                        </span>
                        <ChevronRight className={`w-5 h-5 ${displayMode === 'dark' ? 'text-[#48484A]' : 'text-[#C7C7CC]'}`} />
                      </div>
                    </div>

                    {/* Row 4: Display */}
                    <div 
                      onClick={() => setSettingsSubView('display')}
                      className={`px-4 py-3.5 flex items-center justify-between transition-all cursor-pointer ${
                        displayMode === 'dark' 
                          ? 'hover:bg-[#2C2C2E]/50 active:bg-[#2C2C2E]' 
                          : 'hover:bg-slate-50 active:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7.5 h-7.5 bg-[#FF9500] rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                          <Lightbulb className="w-4.5 h-4.5 stroke-[2.5]" />
                        </div>
                        <span className={`text-[17px] font-normal transition-colors duration-300 ${
                          displayMode === 'dark' ? 'text-gray-200' : 'text-gray-900'
                        }`}>
                          {t("Display", "প্রদর্শন")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[14px] text-gray-400 font-medium capitalize">
                          {t(displayMode, displayMode === 'dark' ? 'ডার্ক মোড' : 'লাইট মোড')}
                        </span>
                        <ChevronRight className={`w-5 h-5 ${displayMode === 'dark' ? 'text-[#48484A]' : 'text-[#C7C7CC]'}`} />
                      </div>
                    </div>

                  </div>

                  {/* GROUP 2 */}
                  <div className={`rounded-[14px] border overflow-hidden shadow-sm transition-colors duration-300 ${
                    displayMode === 'dark' ? 'bg-[#1C1C1E] border-[#2C2C2E]/80' : 'bg-white border-gray-200/60'
                  }`}>
                    
                    {/* Row 5: About Verse Community */}
                    <div 
                      onClick={() => setSettingsSubView('about')}
                      className={`px-4 py-3.5 flex items-center justify-between border-b transition-all cursor-pointer ${
                        displayMode === 'dark' 
                          ? 'border-[#2C2C2E]/50 hover:bg-[#2C2C2E]/50 active:bg-[#2C2C2E]' 
                          : 'border-gray-105 hover:bg-slate-50 active:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7.5 h-7.5 bg-[#AF52DE] rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                          <Users className="w-4.5 h-4.5 stroke-[2.5]" />
                        </div>
                        <span className={`text-[17px] font-normal transition-colors duration-300 ${
                          displayMode === 'dark' ? 'text-gray-200' : 'text-gray-900'
                        }`}>
                          {t("About Verse Community", "ভার্স কমিউনিটি সম্পর্কে")}
                        </span>
                      </div>
                      <ChevronRight className={`w-5 h-5 ${displayMode === 'dark' ? 'text-[#48484A]' : 'text-[#C7C7CC]'}`} />
                    </div>

                    {/* Row 6: Contact */}
                    <div 
                      onClick={() => setSettingsSubView('contact')}
                      className={`px-4 py-3.5 flex items-center justify-between border-b transition-all cursor-pointer ${
                        displayMode === 'dark' 
                          ? 'border-[#2C2C2E]/50 hover:bg-[#2C2C2E]/50 active:bg-[#2C2C2E]' 
                          : 'border-gray-105 hover:bg-slate-50 active:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7.5 h-7.5 bg-[#34C759] rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                          <Phone className="w-4.5 h-4.5 stroke-[2.5]" />
                        </div>
                        <span className={`text-[17px] font-normal transition-colors duration-300 ${
                          displayMode === 'dark' ? 'text-gray-200' : 'text-gray-900'
                        }`}>
                          {t("Contact", "যোগাযোগ")}
                        </span>
                      </div>
                      <ChevronRight className={`w-5 h-5 ${displayMode === 'dark' ? 'text-[#48484A]' : 'text-[#C7C7CC]'}`} />
                    </div>

                    {/* Row 7: About the Bitcoin.com Wallet */}
                    <div 
                      onClick={() => setSettingsSubView('wallet_about')}
                      className={`px-4 py-3.5 flex items-center justify-between border-b transition-all cursor-pointer ${
                        displayMode === 'dark' 
                          ? 'border-[#2C2C2E]/50 hover:bg-[#2C2C2E]/50 active:bg-[#2C2C2E]' 
                          : 'border-gray-105 hover:bg-slate-50 active:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7.5 h-7.5 bg-[#FF3B30] rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-sm font-bold text-base leading-none">
                          ₿
                        </div>
                        <span className={`text-[17px] font-normal transition-colors duration-300 ${
                          displayMode === 'dark' ? 'text-gray-200' : 'text-gray-900'
                        }`}>
                          {t("About the Bitcoin.com Wallet", "Bitcoin.com ওয়ালেট সম্পর্কে")}
                        </span>
                      </div>
                      <ChevronRight className={`w-5 h-5 ${displayMode === 'dark' ? 'text-[#48484A]' : 'text-[#C7C7CC]'}`} />
                    </div>

                    {/* Row 8: About My Website */}
                    <div 
                      onClick={() => setSettingsSubView('about_my_website')}
                      className={`px-4 py-3.5 flex items-center justify-between transition-all cursor-pointer ${
                        displayMode === 'dark' 
                          ? 'hover:bg-[#2C2C2E]/50 active:bg-[#2C2C2E]' 
                          : 'hover:bg-slate-50 active:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7.5 h-7.5 bg-sky-500 rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-sm font-bold text-sm leading-none">
                          ℹ️
                        </div>
                        <span className={`text-[17px] font-bold transition-colors duration-300 ${
                          displayMode === 'dark' ? 'text-gray-200' : 'text-slate-800'
                        }`}>
                          About My Website
                        </span>
                      </div>
                      <ChevronRight className={`w-5 h-5 ${displayMode === 'dark' ? 'text-[#48484A]' : 'text-[#C7C7CC]'}`} />
                    </div>

                  </div>

                </div>
              )}

              {/* SUBVIEW 2: DOWNLOAD WALLET SECTION */}
              {settingsSubView === 'download' && (
                <div className="space-y-6">
                  <div className={`p-5 rounded-[18px] border text-center transition-colors duration-300 ${
                    displayMode === 'dark' ? 'bg-[#1C1C1E] border-[#2C2C2E]' : 'bg-white border-gray-200'
                  }`}>
                    <h3 className={`text-lg font-bold mb-4 ${displayMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {t("Bitcoin.com Wallet Features", "Bitcoin.com ওয়ালেট অপশন")}
                    </h3>

                    {/* Option 1: Direct Download */}
                    <a 
                      href="https://wallet.bitcoin.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-600 to-[#007AFF] text-white hover:opacity-90 active:scale-[0.99] transition-all font-bold shadow-md cursor-pointer mb-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <Download className="w-5 h-5 stroke-[2.5]" />
                        <span>{t("Download Link Here", "ডাউনলোড লিংক এখানে (wallet.bitcoin.com)")}</span>
                      </div>
                      <ExternalLink className="w-4.5 h-4.5" />
                    </a>

                    {/* Option 2: Expandable Preview Drawer */}
                    <button 
                      onClick={() => setSettingsSubView('wallet_about')}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border font-bold transition-all active:scale-[0.99] mb-4 cursor-pointer ${
                        displayMode === 'dark'
                          ? 'border-[#2C2C2E] bg-slate-900 text-gray-200 hover:bg-[#2C2C2E]'
                          : 'border-slate-205 bg-slate-50 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Info className="w-5 h-5 text-indigo-500" />
                        <span>{t("Legal & Wallet Terms", "শর্তাবলী ও অন্যান্য")}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                    
                    {/* Header for features list */}
                    <div className="border-t border-dashed border-gray-300/40 pt-4 mt-2 text-left">
                      <span className="text-xs font-mono font-bold tracking-widest text-[#007AFF] uppercase block mb-3">
                        🛡️ {t("SECURE WALLET FEATURES & PREVIEW", "ওয়ালেট বৈশিষ্ট্য ও রিভিউ")}
                      </span>
                      
                      <div className="space-y-4 text-left">
                        <div className="flex gap-3 items-start">
                          <span className="text-lg flex-shrink-0 mt-0.5">🛡️</span>
                          <div>
                            <h4 className={`text-sm font-extrabold ${displayMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>Self-Custodial & Secure</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">Only you control your crypto. No middlemen, no compromise on security protocols.</p>
                          </div>
                        </div>

                        <div className="flex gap-3 items-start">
                          <span className="text-lg flex-shrink-0 mt-0.5">🌐</span>
                          <div>
                            <h4 className={`text-sm font-extrabold ${displayMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>Multi-Chain Ready</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">Manage Bitcoin, Ethereum, Polygon, BNB Smart Chain, Avalanche, and more—all in one app.</p>
                          </div>
                        </div>

                        <div className="flex gap-3 items-start">
                          <span className="text-lg flex-shrink-0 mt-0.5">🪙</span>
                          <div>
                            <h4 className={`text-sm font-extrabold ${displayMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>Buy, Sell, Swap</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">Seamless crypto purchases, safe asset sales, and instant token swaps with leading world-wide providers.</p>
                          </div>
                        </div>

                        <div className="flex gap-3 items-start">
                          <span className="text-lg flex-shrink-0 mt-0.5">🎯</span>
                          <div>
                            <h4 className={`text-sm font-extrabold ${displayMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>Rewards Center</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">Get free crypto for doing simple daily interactive tasks like reading verified news or analyzing active token prices.</p>
                          </div>
                        </div>

                        <div className="flex gap-3 items-start">
                          <span className="text-lg flex-shrink-0 mt-0.5">🧠</span>
                          <div>
                            <h4 className={`text-sm font-extrabold ${displayMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>Learn & Earn</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">Built-in crypto newsfeed and Learning Center designed to level up your decentralized finance knowledge.</p>
                          </div>
                        </div>

                        <div className="flex gap-3 items-start">
                          <span className="text-lg flex-shrink-0 mt-0.5">💸</span>
                          <div>
                            <h4 className={`text-sm font-extrabold ${displayMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>Cashback & Bonuses</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">Earn VERSE reward loyalty assets and other ecosystem bonus tokens just by actively utilising the application.</p>
                          </div>
                        </div>

                        <div className="flex gap-3 items-start">
                          <span className="text-lg flex-shrink-0 mt-0.5">🏪</span>
                          <div>
                            <h4 className={`text-sm font-extrabold ${displayMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>Merchant Payments</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">
                              Pay with crypto at real-world establishments. Navigate through the official <a href="https://maps.bitcoin.com/" target="_blank" rel="noopener noreferrer" className="text-[#007AFF] hover:underline font-bold inline-flex items-center gap-0.5">maps.bitcoin.com <ExternalLink className="w-3 h-3" /></a> portal to easily find local fUSD-accepting merchants.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3 items-start">
                          <span className="text-lg flex-shrink-0 mt-0.5">🔔</span>
                          <div>
                            <h4 className={`text-sm font-extrabold ${displayMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>Price Alerts & Notifications</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">Stay ahead of major trade block patterns with real-time push alerts on your custom watched assets.</p>
                          </div>
                        </div>

                        <div className="flex gap-3 items-start">
                          <span className="text-lg flex-shrink-0 mt-0.5">👥</span>
                          <div>
                            <h4 className={`text-sm font-extrabold ${displayMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>Invite & Earn</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">Get rewarded and credited for bringing your peer friends safely into non-custodial crypto trading.</p>
                          </div>
                        </div>

                        <div className="flex gap-3 items-start">
                          <span className="text-lg flex-shrink-0 mt-0.5">🚀</span>
                          <div>
                            <h4 className={`text-sm font-extrabold ${displayMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>Fast, Free Setup</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">No static sign-ups required. Simply download, generate secure keys, and explore decentralized systems instantly.</p>
                          </div>
                        </div>
                      </div>

                      {/* Special Download Link Trigger */}
                      <div className="pt-6 text-center">
                        <a 
                          href="https://wallet.bitcoin.com/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-[#007AFF] hover:bg-blue-600 active:scale-95 transition-all rounded-full text-white text-xs font-black uppercase tracking-wider"
                        >
                          <span>🔗 Download Here 🔗</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBVIEW 3: JOIN VERSE COMMUNITY */}
              {settingsSubView === 'join' && (
                <div className="space-y-5">
                  <div className={`p-4 rounded-[18px] border text-center transition-colors duration-300 ${
                    displayMode === 'dark' ? 'bg-[#1C1C1E] text-white border-[#2C2C2E]' : 'bg-white text-slate-900 border-gray-200'
                  }`}>
                    <p className="text-sm font-medium text-gray-400 mb-6 font-sans">
                      {t(
                        "Connect globally with millions of Verse users. Tap any link below to instantly enter our community portal.",
                        "ভার্স ব্যবহারকারীদের সাথে বিশ্বব্যাপী যুক্ত হোন। সরাসরি যোগাযোগ করতে নিচের যেকোনো লিংকে ক্লিক করুন।"
                      )}
                    </p>

                    <div className="space-y-3.5">
                      {/* Link 1: Verse Telegram */}
                      <a 
                        href="https://t.me/GetVerse" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`w-full flex items-center justify-between p-4 rounded-xl border font-bold transition-all active:scale-[0.99] cursor-pointer ${
                          displayMode === 'dark' 
                            ? 'bg-[#29b6f6]/10 text-[#29b6f6] border-[#29b6f6]/20 hover:bg-[#29b6f6]/15' 
                            : 'bg-[#e3f2fd] text-[#1976d2] border-[#29afef]/20 hover:bg-[#d0e8fc]'
                        }`}
                      >
                        <span className="text-[16px]">💬 Verse Telegram Community</span>
                        <ExternalLink className="w-4.5 h-4.5" />
                      </a>

                      {/* Link 2: Verse Twitter */}
                      <a 
                        href="https://twitter.com/VerseEcosystem" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`w-full flex items-center justify-between p-4 rounded-xl border font-bold transition-all active:scale-[0.99] cursor-pointer ${
                          displayMode === 'dark' 
                            ? 'bg-white/5 text-gray-200 border-white/10 hover:bg-white/10' 
                            : 'bg-slate-50 text-slate-800 border-slate-205 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-[16px]">🐦 Verse Twitter Community</span>
                        <ExternalLink className="w-4.5 h-4.5" />
                      </a>

                      {/* Link 3: Bitcoin Official Community */}
                      <a 
                        href="https://twitter.com/BitcoinCom" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`w-full flex items-center justify-between p-4 rounded-xl border font-bold transition-all active:scale-[0.99] cursor-pointer ${
                          displayMode === 'dark' 
                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/15' 
                            : 'bg-amber-50 text-amber-850 border-amber-205 hover:bg-amber-100'
                        }`}
                      >
                        <span className="text-[16px]">🪙 Bitcoin Official Community</span>
                        <ExternalLink className="w-4.5 h-4.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBVIEW 4: LANGUAGE SETTINGS */}
              {settingsSubView === 'language' && (
                <div className="space-y-4">
                  <div className={`rounded-[14px] border overflow-hidden shadow-sm transition-colors duration-300 ${
                    displayMode === 'dark' ? 'bg-[#1C1C1E] border-[#2C2C2E]' : 'bg-white border-gray-200'
                  }`}>
                    {/* Option English */}
                    <div 
                      onClick={() => {
                        setAppLanguage('en');
                        setFooterDescLang('en');
                        safeStorage.setItem('appLanguage', 'en');
                      }}
                      className={`px-4 py-4 flex items-center justify-between transition-all cursor-pointer ${
                        displayMode === 'dark' 
                          ? 'hover:bg-slate-800/40' 
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-[17px] font-bold text-[#007AFF]">
                        English (US)
                      </span>
                      <Check className="w-5 h-5 text-[#007AFF] stroke-[3]" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 px-2">
                    {t(
                      "Choosing a language will automatically translate the entire layout, welcome modules, system interfaces, and setting categories into your selected dialect.",
                      "একটি ভাষা নির্বাচন করলে সেটিংস এবং ওয়েবসাইটের প্রথম থেকে শুরু করে সমস্ত ইন্টারফেস স্বয়ংক্রিয়ভাবে অনুবাদ হয়ে যাবে।"
                    )}
                  </p>
                </div>
              )}

              {/* SUBVIEW 5: DISPLAY / THEMING */}
              {settingsSubView === 'display' && (
                <div className="space-y-4">
                  <div className={`rounded-[14px] border overflow-hidden shadow-sm transition-colors duration-300 ${
                    displayMode === 'dark' ? 'bg-[#1C1C1E] border-[#2C2C2E]' : 'bg-white border-gray-200'
                  }`}>
                    {/* Option Light Mode */}
                    <div 
                      onClick={() => {
                        setDisplayMode('light');
                        safeStorage.setItem('displayMode', 'light');
                      }}
                      className={`px-4 py-4 flex items-center justify-between border-b transition-all cursor-pointer ${
                        displayMode === 'dark' 
                          ? 'border-[#2C2C2E]/60 hover:bg-slate-800/40' 
                          : 'border-gray-100 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-white font-bold text-xs">
                          ☀
                        </div>
                        <span className={`text-[17px] font-medium ${displayMode === 'light' ? 'text-[#007AFF] font-bold' : ''}`}>
                          Light Mode
                        </span>
                      </div>
                      {displayMode === 'light' && <Check className="w-5 h-5 text-[#007AFF] stroke-[3]" />}
                    </div>

                    {/* Option Dark Mode */}
                    <div 
                      onClick={() => {
                        setDisplayMode('dark');
                        safeStorage.setItem('displayMode', 'dark');
                      }}
                      className={`px-4 py-4 flex items-center justify-between transition-all cursor-pointer ${
                        displayMode === 'dark' 
                          ? 'hover:bg-slate-800/40' 
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-indigo-900 flex items-center justify-center text-white font-bold text-xs">
                          ☾
                        </div>
                        <span className={`text-[17px] font-medium ${displayMode === 'dark' ? 'text-[#007AFF] font-bold' : ''}`}>
                          Dark Mode
                        </span>
                      </div>
                      {displayMode === 'dark' && <Check className="w-5 h-5 text-[#007AFF] stroke-[3]" />}
                    </div>
                  </div>
                </div>
              )}

              {/* SUBVIEW 6: ABOUT VERSE COMMUNITY (Translated to English, formatted elegantly with Mint Green/Turquoise/Aqua themes) */}
              {settingsSubView === 'about' && (
                <div className="space-y-6">
                  <div className="rounded-[24px] overflow-hidden border border-emerald-500/20 shadow-2xl bg-gradient-to-br from-[#0bd8b4]/90 via-[#00a896] to-[#028090] text-white p-6 md:p-8 relative">
                    {/* Ambient light overlay */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-teal-300/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-3 pb-3 border-b border-white/20">
                        <div className="p-2.5 bg-white/20 rounded-xl">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black tracking-tight text-white font-sans uppercase">
                            About Verse Community
                          </h3>
                          <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-100 block">
                            Our Global Vision, Learning Ecosystem & Network
                          </span>
                        </div>
                      </div>

                      <div className="space-y-5 text-sm md:text-base leading-relaxed font-sans text-emerald-50 font-normal">
                        <p>
                          The Verse Community is an open and collaborative platform where opportunities are created to learn about, discover, and support one another in cryptocurrency, Bitcoin, Web3, and the Verse Ecosystem. Our goal is not merely to distribute information, but to cultivate an environment where both newcomer and veteran members alike can expand their knowledge and move forward with absolute confidence in this rapidly evolving tech landscape.
                        </p>
                        
                        <p>
                          Interest in crypto and blockchain technologies is growing exponentially today. Yet, many new users encounter friction trying to decipher complex, technical vocabulary. The Verse Community works deliberately to simplify these challenges. We strive to break down intricate concepts into clear, accessible language, empowering everyone to learn step-by-step and steadily refine their skills.
                        </p>

                        <p>
                          One of our most fundamental missions is supporting our community members with high-value educational content and real-world practical use cases. Here, we share a rich variety of guides, blueprints, tutorials, analytical coverage, and functional insights that deepen existing knowledge while introducing new concepts. We firmly believe that standard resources combined with consistent learning are what shape smarter, more resilient, and highly confident crypto users.
                        </p>

                        <p>
                          Another defining characteristic of the Verse Community is active member participation. We seek to foster an open space where every member feels welcome to share their native insights, ask questions, and assist fellow peers. A robust, thriving community is built collectively through knowledge sharing and hands-on cooperation, and we dedicate ourselves daily to that core vision.
                        </p>

                        <p>
                          We host and organize diverse educational campaigns, interactive discussion panels, and exclusive events. Through these collaborative actions, members quickly spot brand new opportunities, showcase their unique skills, and form valuable connections with peers. By engaging regularly, members do not just consume data; they actively weave themselves into a supportive, living network of Web3 advocates.
                        </p>

                        <p>
                          Functional updates, deep analyses, and instructive blueprints focusing on the Verse Ecosystem form the cornerstone of our resources. We are fully committed to publishing content that demystifies decentralized protocols and genuinely enriches each member&#39;s personal learning journey.
                        </p>

                        <p>
                          The Verse Community operates on the belief that learning never truly ends. Because decentralized technology is in a state of constant upgrade, presenting fresh innovations and unique use cases daily, we invite our members to stay endlessly curious. Ask bold questions, master new tools, and pass your wisdom along. A community achieves true resilience when we learn as one, rise as one, and constantly support each other.
                        </p>

                        <p>
                          We aspire to co-create a future where shared knowledge, cross-border cooperation, and innovative Web3 solutions act as our compass. The Verse Community represents the vessel for that journey—where every single member carries weight, every inquiry is highly valued, and every masterclass opens up pathways to new heights.
                        </p>

                        <div className="bg-white/10 rounded-2xl p-4 md:p-5 border border-white/15 shadow-inner">
                          <p className="font-semibold text-white">
                            Welcome to the Verse Community. We are absolutely honored and thrilled to have you alongside us on this epoch-defining quest. We hope you gather immense value here, build lifelong connections with fascinating minds, and elevate your personal growth as an integral part of our supportive and positive home.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBVIEW 7: CONTACTS */}
              {settingsSubView === 'contact' && (
                <div className="space-y-5">
                  <div className={`p-4 rounded-[18px] border transition-colors duration-300 ${
                    displayMode === 'dark' ? 'bg-[#1C1C1E] text-white border-[#2C2C2E]' : 'bg-white text-slate-800 border-gray-200'
                  }`}>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#34C759] uppercase block mb-4">
                      📞 DIRECT TELEGRAM NETWORKS
                    </span>

                    <div className="space-y-3">
                      {/* Contact 1 */}
                      <a 
                        href="https://t.me/stone_brb" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all active:scale-[0.99] cursor-pointer ${
                          displayMode === 'dark' 
                            ? 'bg-slate-900 border-[#2C2C2E] text-white hover:bg-[#2C2C2E]' 
                            : 'bg-slate-50 border-gray-105 text-gray-900 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-left">
                          <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Our JT Boss</h4>
                          <span className="text-[16px] font-bold">@stone_brb</span>
                        </div>
                        <ExternalLink className="w-4.5 h-4.5 text-[#34C759]" />
                      </a>

                      {/* Contact 2 */}
                      <a 
                        href="https://t.me/juwelrana1012" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all active:scale-[0.99] cursor-pointer ${
                          displayMode === 'dark' 
                            ? 'bg-slate-900 border-[#2C2C2E] text-white hover:bg-[#2C2C2E]' 
                            : 'bg-slate-50 border-gray-105 text-gray-900 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-left">
                          <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Anytime Contact</h4>
                          <span className="text-[16px] font-bold">@juwelrana1012</span>
                        </div>
                        <ExternalLink className="w-4.5 h-4.5 text-[#34C759]" />
                      </a>

                      {/* Contact 3 */}
                      <a 
                        href="https://t.me/GetVerse/177601" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all active:scale-[0.99] cursor-pointer ${
                          displayMode === 'dark' 
                            ? 'bg-slate-900 border-[#2C2C2E] text-white hover:bg-[#2C2C2E]' 
                            : 'bg-slate-50 border-gray-105 text-gray-900 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-left">
                          <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Any problem asked</h4>
                          <span className="text-[15px] font-semibold">t.me/GetVerse/177601</span>
                        </div>
                        <ExternalLink className="w-4.5 h-4.5 text-[#34C759]" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBVIEW 8: ABOUT BITCOIN.COM WALLET (LEGAL LINKS) */}
              {settingsSubView === 'wallet_about' && (
                <div className="space-y-5">
                  <div className={`p-4 rounded-[18px] border transition-colors duration-300 ${
                    displayMode === 'dark' ? 'bg-[#1C1C1E] text-white border-[#2C2C2E]' : 'bg-white text-slate-800 border-gray-200'
                  }`}>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#FF3B30] uppercase block mb-4">
                      ⚖️ WALLET SERVICE TERMS & ACCREDITATION
                    </span>

                    <div className="space-y-3">
                      {/* Link 1: General T&C */}
                      <a 
                        href="https://www.bitcoin.com/bn/legal/user-agreement/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all active:scale-[0.99] cursor-pointer ${
                          displayMode === 'dark' 
                            ? 'bg-slate-900 border-[#2C2C2E] text-white hover:bg-[#2C2C2E]' 
                            : 'bg-slate-50 border-gray-105 text-gray-900 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-[15px] font-semibold">General Terms & Conditions</span>
                        <ExternalLink className="w-4 h-4 text-[#FF3B30]" />
                      </a>

                      {/* Link 2: Wallet Service Terms */}
                      <a 
                        href="https://www.bitcoin.com/bn/legal/wallet-service-terms/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all active:scale-[0.99] cursor-pointer ${
                          displayMode === 'dark' 
                            ? 'bg-slate-900 border-[#2C2C2E] text-white hover:bg-[#2C2C2E]' 
                            : 'bg-slate-50 border-gray-105 text-gray-900 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-[15px] font-semibold">Wallet Service Terms</span>
                        <ExternalLink className="w-4 h-4 text-[#FF3B30]" />
                      </a>

                      {/* Link 3: Visit Bitcoin.com */}
                      <a 
                        href="https://www.bitcoin.com/bn/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all active:scale-[0.99] cursor-pointer ${
                          displayMode === 'dark' 
                            ? 'bg-slate-900 border-[#2C2C2E] text-white hover:bg-[#2C2C2E]' 
                            : 'bg-slate-50 border-gray-105 text-gray-900 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-[15px] font-semibold">Visit Bitcoin.com</span>
                        <ExternalLink className="w-4 h-4 text-[#FF3B30]" />
                      </a>

                      {/* Link 4: Privacy Policy */}
                      <a 
                        href="https://www.bitcoin.com/bn/privacy-policy/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all active:scale-[0.99] cursor-pointer ${
                          displayMode === 'dark' 
                            ? 'bg-slate-900 border-[#2C2C2E] text-white hover:bg-[#2C2C2E]' 
                            : 'bg-slate-50 border-gray-105 text-gray-900 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-[15px] font-semibold">Privacy Policy</span>
                        <ExternalLink className="w-4 h-4 text-[#FF3B30]" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBVIEW 9: ABOUT MY WEBSITE */}
              {settingsSubView === 'about_my_website' && (
                <div className="space-y-5">
                  <div className={`p-6 rounded-[24px] border shadow-md space-y-5 transition-colors duration-300 ${
                    displayMode === 'dark' 
                      ? 'bg-[#1C1C1E] border-[#2C2C2E]' 
                      : 'border-sky-250 bg-sky-50 text-slate-800'
                  }`}>
                    <div className={`flex items-center gap-3 pb-3 border-b ${
                      displayMode === 'dark' ? 'border-[#2C2C2E]' : 'border-sky-200'
                    }`}>
                      <div className={`p-2 rounded-xl ${
                        displayMode === 'dark' ? 'bg-[#2C2C2E] text-sky-400' : 'bg-sky-100 text-sky-700'
                      }`}>
                        <Info className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <h3 className={`text-lg sm:text-xl font-black uppercase ${
                          displayMode === 'dark' ? 'text-white' : 'text-sky-900'
                        }`}>
                          About My Website
                        </h3>
                        <p className={`text-[10px] uppercase font-mono tracking-wider font-extrabold ${
                          displayMode === 'dark' ? 'text-sky-400' : 'text-sky-700'
                        }`}>
                          Educational & Informational Platform
                        </p>
                      </div>
                    </div>

                    <div className={`space-y-5 text-sm sm:text-base leading-relaxed font-medium ${
                      displayMode === 'dark' ? 'text-gray-300' : 'text-slate-800'
                    }`}>
                      {/* Section 1 */}
                      <div className={`space-y-2 p-4 rounded-2xl border shadow-sm text-left ${
                        displayMode === 'dark' ? 'bg-black/40 border-[#2C2C2E]' : 'bg-white border-sky-100'
                      }`}>
                        <h4 className="text-sm sm:text-base font-black text-sky-500 font-sans uppercase">
                          (1) About this website
                        </h4>
                        <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${
                          displayMode === 'dark' ? 'text-gray-300' : 'text-slate-700'
                        }`}>
                          This website has been created for educational and informational purposes only, so that users can easily learn and understand Bitcoin.com Wallet's various features, usage methods and cryptocurrency ecosystem. Efforts are made to keep market prices and other information displayed here as accurate as possible.
                        </p>
                      </div>

                      {/* Section 2 */}
                      <div className={`space-y-2 p-4 rounded-2xl border shadow-sm text-left ${
                        displayMode === 'dark' ? 'bg-black/40 border-[#2C2C2E]' : 'bg-white border-sky-100'
                      }`}>
                        <h4 className="text-sm sm:text-base font-black text-[#8b5e3c] font-sans uppercase">
                          (2) Educational and informational platforms
                        </h4>
                        <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${
                          displayMode === 'dark' ? 'text-gray-300' : 'text-slate-700'
                        }`}>
                          This website is not the official website or app of Bitcoin.com Wallet and has no direct affiliation or endorsement with Bitcoin.com. The various features, interfaces and information displayed here are presented only for the convenience of the users, so that they can easily analyze and understand the various topics.
                        </p>
                        <div className={`text-[11px] font-mono font-black flex items-center gap-1 opacity-90 ${
                          displayMode === 'dark' ? 'text-amber-400' : 'text-amber-700'
                        }`}>
                          Demo→Educational→Guide→Information Hub
                        </div>
                      </div>

                      {/* Section 3 */}
                      <div className={`space-y-2 p-4 rounded-2xl border shadow-sm text-left ${
                        displayMode === 'dark' ? 'bg-black/40 border-[#2C2C2E]' : 'bg-white border-sky-100'
                      }`}>
                        <h4 className="text-sm sm:text-base font-black text-rose-500 font-sans uppercase">
                          (3) For official app usage
                        </h4>
                        <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${
                          displayMode === 'dark' ? 'text-gray-300' : 'text-slate-700'
                        }`}>
                          Please use the official Bitcoin.com platform to download and use the official Bitcoin.com Wallet app. This website is created for informational, educational and user awareness purposes only. The various information, instructions and topics provided here will help users to learn and understand Bitcoin.com and the VERSE Ecosystem in depth.
                        </p>
                        <div className="pt-2">
                          <a 
                            href="https://wallet.bitcoin.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-[#007AFF] text-white text-xs font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
                          >
                            Download here : wallet.bitcoin.com
                          </a>
                        </div>
                      </div>

                      {/* Section 4 */}
                      <div className={`space-y-2 p-4 rounded-2xl border shadow-sm text-left ${
                        displayMode === 'dark' ? 'bg-black/40 border-[#2C2C2E]' : 'bg-white border-sky-100'
                      }`}>
                        <h4 className="text-sm sm:text-base font-black text-indigo-400 font-sans uppercase">
                          (4) Learn about ecosystems
                        </h4>
                        <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${
                          displayMode === 'dark' ? 'text-gray-300' : 'text-slate-700'
                        }`}>
                          Bitcoin.com Ecosystem, Wallet Features, Market Information and other important topics are discussed in detail in various sections of this website. Through this, users can learn, understand and analyze the entire ecosystem with real-world experience.
                        </p>
                      </div>

                      {/* Section 5 */}
                      <div className={`space-y-2 p-4 rounded-2xl border shadow-sm text-left ${
                        displayMode === 'dark' ? 'bg-black/40 border-[#2C2C2E]' : 'bg-white border-sky-100'
                      }`}>
                        <h4 className="text-sm sm:text-base font-black text-purple-400 font-sans uppercase">
                          (5) VERSE AND RELATED SUBJECTS
                        </h4>
                        <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${
                          displayMode === 'dark' ? 'text-gray-300' : 'text-slate-700'
                        }`}>
                          Also, various topics related to VERSE Token and its various uses, utilities, community and ecosystem are discussed here. This information will help users to better know and understand the VERSE Ecosystem.
                        </p>
                      </div>

                      {/* Section 6 */}
                      <div className={`space-y-2 p-4 rounded-2xl border shadow-sm text-left ${
                        displayMode === 'dark' ? 'bg-black/40 border-[#2C2C2E]' : 'bg-white border-sky-100'
                      }`}>
                        <h4 className="text-sm sm:text-base font-black text-emerald-500 font-sans uppercase">
                          (6) Especially important for new users
                        </h4>
                        <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${
                          displayMode === 'dark' ? 'text-gray-300' : 'text-slate-700'
                        }`}>
                          This platform is very important for those who are new to Cryptocurrency, Blockchain, Bitcoin.com Ecosystem or VERSE and don't know much about these networks and technologies. An attempt has been made here to explain various topics in simple language, so that even new users can gradually gain an understanding of the entire ecosystem.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real-time Admin Analytics & Database Console Panel */}
      <AnimatePresence>
        {showAdminDashboard && (
          <AdminDashboard 
            displayMode={displayMode} 
            onClose={() => setShowAdminDashboard(false)} 
          />
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
                    result === 'correct' ? 'bg-emerald-500/20 text-emerald-600' : 'bg-red-500/20 text-red-600'
                  }`}
                >
                  {result === 'correct' ? 'Success!' : 'Wrong! Try again.'}
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
  setMarketData,
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
  setMarketData: React.Dispatch<React.SetStateAction<Record<string, MarketData>>>;
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
  const [expandedIntro, setExpandedIntro] = useState<boolean>(false);

  // --- Price Alerts State & Logic ---
  const [priceAlerts, setPriceAlerts] = useState<{
    id: string;
    token: string;
    targetValue: number;
    condition: 'above' | 'below';
    triggered: boolean;
    createdAt: Date;
    triggeredAt?: Date;
  }[]>(() => {
    try {
      const u = safeStorage.getItem('verseUser') || 'default';
      const saved = safeStorage.getItem(`verse_price_alerts_${u}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          triggeredAt: item.triggeredAt ? new Date(item.triggeredAt) : undefined
        }));
      }
    } catch (e) {
      console.error("Error loading price alerts:", e);
    }
    return [];
  });

  const [toasts, setToasts] = useState<{ id: string; message: string; sub: string; token: string }[]>([]);

  // Monitor prices for alerts
  useEffect(() => {
    let triggeredAny = false;
    const triggeredList: { id: string; message: string; sub: string; token: string }[] = [];

    setPriceAlerts(prev => {
      let isChanged = false;
      const next = prev.map(alert => {
        if (alert.triggered) return alert;
        const currentPrice = marketData[alert.token]?.price;
        if (currentPrice === undefined) return alert;

        let isHit = false;
        if (alert.condition === 'above' && currentPrice >= alert.targetValue) {
          isHit = true;
        } else if (alert.condition === 'below' && currentPrice <= alert.targetValue) {
          isHit = true;
        }

        if (isHit) {
          isChanged = true;
          triggeredAny = true;
          const formattedTarget = alert.targetValue < 1 ? `$${alert.targetValue.toFixed(4)}` : `$${alert.targetValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          const formattedCurrent = currentPrice < 1 ? `$${currentPrice.toFixed(4)}` : `$${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          
          triggeredList.push({
            id: Math.random().toString(36).substring(2, 9),
            message: `🔔 Price Alert Triggered: ${alert.token}`,
            sub: `${alert.token} has reached ${formattedCurrent} (Target ${alert.condition === 'above' ? '≥' : '≤'} ${formattedTarget})`,
            token: alert.token
          });

          return {
            ...alert,
            triggered: true,
            triggeredAt: new Date()
          };
        }
        return alert;
      });

      if (isChanged) {
        try {
          const u = safeStorage.getItem('verseUser') || 'default';
          safeStorage.setItem(`verse_price_alerts_${u}`, JSON.stringify(next));
        } catch (e) {
          console.error(e);
        }
        return next;
      }
      return prev;
    });

    if (triggeredAny && triggeredList.length > 0) {
      setToasts(prev => [...prev, ...triggeredList]);
      triggeredList.forEach(item => {
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== item.id));
        }, 8000);
      });
    }
  }, [marketData]);

  // Alert Creation states
  const [newAlertToken, setNewAlertToken] = useState<string>('VERSE');
  const [newAlertCondition, setNewAlertCondition] = useState<'above' | 'below'>('above');
  const [newAlertPrice, setNewAlertPrice] = useState<string>('');

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(newAlertPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      triggerError("Please enter a valid target price greater than 0.");
      return;
    }

    const newId = Math.random().toString(36).substring(2, 9);
    const newAlert = {
      id: newId,
      token: newAlertToken,
      targetValue: parsedPrice,
      condition: newAlertCondition,
      triggered: false,
      createdAt: new Date()
    };

    setPriceAlerts(prev => {
      const next = [newAlert, ...prev];
      try {
        const u = safeStorage.getItem('verseUser') || 'default';
        safeStorage.setItem(`verse_price_alerts_${u}`, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });

    setNewAlertPrice('');
    triggerSuccess(`Added price alert: ${newAlertToken} ${newAlertCondition} $${parsedPrice.toLocaleString()}`);
  };

  const handleDeleteAlert = (id: string) => {
    setPriceAlerts(prev => {
      const next = prev.filter(a => a.id !== id);
      try {
        const u = safeStorage.getItem('verseUser') || 'default';
        safeStorage.setItem(`verse_price_alerts_${u}`, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    triggerSuccess("Price alert removed successfully.");
  };

  const handleClearTriggeredAlerts = () => {
    setPriceAlerts(prev => {
      const next = prev.filter(a => !a.triggered);
      try {
        const u = safeStorage.getItem('verseUser') || 'default';
        safeStorage.setItem(`verse_price_alerts_${u}`, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    triggerSuccess("Cleared triggered price alerts history.");
  };

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
      className="space-y-8 relative"
    >
      {/* Floating Price Alerts Toasts Container */}
      <div className="fixed top-6 right-6 z-[9999] pointer-events-none space-y-3 max-w-sm w-full px-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.9 }}
              className="bg-slate-900/95 border border-amber-500/30 text-white p-4 rounded-2xl shadow-2xl backdrop-blur-md flex items-start gap-4 pointer-events-auto relative overflow-hidden"
            >
              {/* Gold Indicator Ribbon */}
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-amber-500" />
              
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Bell className="w-4 h-4" />
              </div>

              <div className="flex-1 space-y-1">
                <h5 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center justify-between">
                  {toast.message}
                </h5>
                <p className="text-[11px] text-gray-200 font-mono leading-relaxed">
                  {toast.sub}
                </p>
                <span className="inline-block text-[8px] font-mono bg-white/10 text-white/80 px-1.5 py-0.5 rounded">
                  Price Alert
                </span>
              </div>

              <button
                type="button"
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-gray-400 hover:text-white p-1 text-xs cursor-pointer focus:outline-none"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Premium Educational Journey Banner */}
      <div className="w-full bg-white border border-[#c0a080]/20 rounded-[2rem] p-6 shadow-sm relative overflow-hidden text-slate-800">
        <div className="absolute top-0 right-0 p-6 text-[#c0a080]/10 pointer-events-none">
          <BookOpen className="w-20 h-20 stroke-[1]" />
        </div>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#c0a080]/10 border border-[#c0a080]/20 flex items-center justify-center text-[#8b5e3c] flex-shrink-0">
            <Info className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0 space-y-1.5">
            <h4 className="text-sm font-black text-[#8b5e3c] uppercase tracking-wider">
              Educational Wallet Story &amp; Mission / ওয়ালেট মিশন ও ইতিহাস
            </h4>
            
            <div className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
              {!expandedIntro ? (
                <p>
                  <span>When I first entered the world of cryptocurrency, I had very little knowledge...</span>{' '}
                  <button
                    onClick={() => setExpandedIntro(true)}
                    className="text-[#8b5e3c] hover:text-[#c0a080] font-black underline cursor-pointer ml-1 inline-flex items-center gap-1 focus:outline-none"
                  >
                    More Details
                  </button>
                </p>
              ) : (
                <div className="space-y-3">
                  <p>
                    When I first entered the world of cryptocurrency, I had very little knowledge about how to swap, trade, convert, or sell crypto assets. Due to this lack of understanding, I became a victim of scams on several occasions and experienced financial losses.
                  </p>
                  <p>
                    These experiences inspired me to create Verse Wallet. My goal was to build an educational platform where beginners could learn the fundamentals of cryptocurrency in a simple and easy-to-understand way.
                  </p>
                  <p>
                    Through Verse Wallet, new users can learn what cryptocurrency is, how to use a wallet, how to swap, trade, and convert digital assets, and how to manage their funds safely and efficiently.
                  </p>
                  <p>
                    I believe that knowledge is the foundation of success and security in the crypto space, and Verse Wallet is designed to provide a simple and reliable starting point for anyone beginning their crypto journey.
                  </p>
                  <button
                    onClick={() => setExpandedIntro(false)}
                    className="text-[#8b5e3c] hover:text-[#c0a080] font-black underline cursor-pointer mt-2 block focus:outline-none"
                  >
                    Show Less
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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

          {/* TOKEN PRICE ALERTS CARD */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 space-y-6 shadow-xl text-slate-800">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#c0a080]" />
                Price Alerts
              </h4>
              {priceAlerts.some(a => a.triggered) && (
                <button
                  type="button"
                  onClick={handleClearTriggeredAlerts}
                  className="text-[10px] text-[#bd9471] hover:text-rose-500 font-bold font-mono tracking-tight uppercase cursor-pointer"
                >
                  Clear Triggered
                </button>
              )}
            </div>

            {/* Price Alert Creation Form */}
            <form onSubmit={handleAddAlert} className="space-y-3 bg-slate-50 p-4 rounded-3xl border border-gray-100">
              <span className="text-[10px] font-mono tracking-wider font-extrabold text-[#bd9471] uppercase block mb-1">Create Price Alert</span>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block mb-1">Token</label>
                  <select
                    value={newAlertToken}
                    onChange={(e) => setNewAlertToken(e.target.value)}
                    className="w-full text-xs font-bold border border-gray-200 bg-white px-2.5 py-1.5 rounded-xl text-slate-700 focus:outline-none focus:border-[#c0a080]"
                  >
                    {SUPPORTED_TOKENS.map(t => (
                      <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block mb-1">Condition</label>
                  <select
                    value={newAlertCondition}
                    onChange={(e) => setNewAlertCondition(e.target.value as 'above' | 'below')}
                    className="w-full text-xs font-bold border border-gray-200 bg-white px-2.5 py-1.5 rounded-xl text-slate-700 focus:outline-none focus:border-[#c0a080]"
                  >
                    <option value="above">Goes Above (≥)</option>
                    <option value="below">Goes Below (≤)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">Target Price (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono font-bold">$</span>
                  <input
                    type="number"
                    step="any"
                    placeholder={marketData[newAlertToken]?.price ? marketData[newAlertToken].price.toString() : "0.00"}
                    value={newAlertPrice}
                    onChange={(e) => setNewAlertPrice(e.target.value)}
                    className="w-full pl-6 pr-3 py-1.5 text-xs font-mono font-bold border border-gray-200 bg-white rounded-xl text-slate-700 focus:outline-none focus:border-[#c0a080]"
                  />
                </div>
                <div className="text-[9px] text-[#bd9471] font-mono flex justify-between px-1">
                  <span>Current: ${marketData[newAlertToken]?.price ? (marketData[newAlertToken].price < 1 ? marketData[newAlertToken].price.toFixed(4) : marketData[newAlertToken].price.toLocaleString()) : '0.00'}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = marketData[newAlertToken]?.price;
                      if (cur) setNewAlertPrice(cur.toString());
                    }}
                    className="hover:underline focus:outline-none"
                  >
                    Use Current
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-950 text-white hover:bg-[#c0a080] transition-colors font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Add Price Alert
              </button>
            </form>

            {/* List of Alerts */}
            <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
              {priceAlerts.length > 0 ? (
                priceAlerts.map(alert => {
                  const currentPrice = marketData[alert.token]?.price || 0;
                  const percentToTarget = alert.targetValue > 0 ? Math.abs((currentPrice - alert.targetValue) / alert.targetValue) * 100 : 0;
                  
                  return (
                    <div 
                      key={alert.id} 
                      className={`relative overflow-hidden p-3 border rounded-2xl transition-all ${
                        alert.triggered 
                          ? 'bg-amber-500/5 border-amber-500/10 opacity-75' 
                          : 'bg-white border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-800">{alert.token}</span>
                          <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                            alert.condition === 'above' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
                          }`}>
                            {alert.condition === 'above' ? '≥' : '≤'} ${alert.targetValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 relative z-10">
                          {alert.triggered ? (
                            <span className="text-[9px] font-mono text-[#8b5e3c] bg-amber-500/10 px-1.5 py-0.5 rounded-full font-bold font-mono">
                              Triggered
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono text-slate-400">
                              {percentToTarget.toFixed(1)}% away
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteAlert(alert.id)}
                            className="text-gray-300 hover:text-rose-500 p-1 rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
                            title="Delete Alert"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Spark progress track or timestamp info */}
                      <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-gray-400">
                        <span>Current: ${currentPrice < 1 ? currentPrice.toFixed(4) : currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        <span>
                          {alert.triggeredAt 
                            ? `Sent: ${new Date(alert.triggeredAt).toLocaleTimeString()}` 
                            : `Set: ${new Date(alert.createdAt).toLocaleTimeString()}`}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-gray-300 text-xs italic font-serif">
                  No active price alerts.
                </div>
              )}
            </div>

            {/* MOCK PRICE STIMULATOR BUTTON (Allows user to play with triggers instantly!) */}
            <div className="pt-2 border-t border-amber-500/5">
              <button
                type="button"
                onClick={() => {
                  setMarketData(prev => {
                    const next = { ...prev };
                    Object.keys(next).forEach(symbol => {
                      const rand = Math.random() - 0.5; // -0.5 to 0.5
                      const factor = rand > 0 ? 1.08 : 0.92; // +8% or -8%
                      next[symbol] = {
                        ...next[symbol],
                        price: next[symbol].price * factor,
                        sparkline: [...next[symbol].sparkline.slice(1), next[symbol].price * factor]
                      };
                    });
                    return next;
                  });
                  triggerSuccess("Simulated market volatility! Token prices updated by ±8%.");
                }}
                className="w-full py-2 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-100 text-emerald-800 transition-colors font-bold text-[10px] font-mono uppercase tracking-widest rounded-xl text-center flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 animate-spin" />
                Simulate ±8% Volatility (Instant Test)
              </button>
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
