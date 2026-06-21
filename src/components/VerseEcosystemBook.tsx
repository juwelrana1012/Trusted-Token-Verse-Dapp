import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight,
  BookOpen, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Bookmark, 
  Search, 
  Trophy, 
  CheckCircle2, 
  HelpCircle, 
  Info, 
  Layers, 
  Globe, 
  Cpu, 
  Coins, 
  Users, 
  BookMarked, 
  Clock, 
  Compass, 
  Flame,
  Check,
  RotateCcw,
  Book,
  X,
  Sliders,
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
  }
};

interface SubTopic {
  id: string;
  title: string;
  bengaliTitle: string;
  description: string;
  bengaliDescription: string;
  bullets: string[];
  bengaliBullets: string[];
}

interface Chapter {
  id: number;
  title: string;
  bengaliTitle: string;
  icon: any;
  iconColor: string;
  summary: string;
  bengaliSummary: string;
  topics: SubTopic[];
  quiz: {
    question: string;
    bengaliQuestion: string;
    options: string[];
    bengaliOptions: string[];
    answerIndex: number;
    explanation: string;
    bengaliExplanation: string;
  };
}

// Full chapters data following user criteria exactly
const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: "Foundation & History",
    bengaliTitle: "Foundation & Early History",
    icon: Clock,
    iconColor: "text-amber-400",
    summary: "Explore the evolution of currency, the rise of the digital economy, and the historic cryptographic events that gave birth to Bitcoin and modern blockchain technology.",
    bengaliSummary: "Explore the journey of money's evolution, the rise of the digital economy, and the historic cryptographic events that gave birth to Bitcoin and blockchain.",
    topics: [
      {
        id: "1.1",
        title: "The Evolution of Money & Ledger Systems",
        bengaliTitle: "Evolution of Money & Ledgers",
        description: "From barter transactions, physical coins, and representative paper documents to digitized numbers, the nature of money has transitioned from trust in tangible commodities to trust in centralized ledger systems managed by banking institutions.",
        bengaliDescription: "From barter systems, metal coins, and paper money to today's digital numbers, the core foundation of finance has always been the record-keeping ledger. In the past, banks managed these ledgers centrally, but cryptocurrency has decentralized them.",
        bullets: [
          "Barter System: Directly exchanging goods based on immediate physical needs.",
          "Commodity & Fiat Currency: Emergence of precious metals and backed banknotes.",
          "Digital Ledgers: Computerized database rows in commercial bank private servers."
        ],
        bengaliBullets: [
          "Barter System: Conducting early trade through direct exchange of goods.",
          "Metal & Fiat Money: Precious metals and later paper notes run under government authority.",
          "Digital Ledger: Account rows stored statically on commercial banks' central servers."
        ]
      },
      {
        id: "1.2",
        title: "Why Bitcoin Was Created & Satoshi Nakamoto",
        bengaliTitle: "Why Bitcoin Was Created & Satoshi Nakamoto",
        description: "Launched during the devastating 2008 global financial crisis, Bitcoin was engineered as a direct replacement for failing centralized banking models. It was published under the pseudonym Satoshi Nakamoto to provide peer-to-peer electronic cash without a single point of failure.",
        bengaliDescription: "Bitcoin was born during the massive global financial crisis of 2008. Its objective was to facilitate direct financial transactions between individuals without intervention from banks or governments, created by the anonymous Satoshi Nakamoto.",
        bullets: [
          "Peer-to-Peer Cash: Transferring wealth globally without any intermediary bank.",
          "Censorship Resistant: No entity can freeze accounts, block transactions, or print more supply.",
          "Satoshi Nakamoto: A decentralized ideal designed by an anonymous cryptographic pioneer."
        ],
        bengaliBullets: [
          "Peer-to-Peer Cash: Direct financial transactions globally without any intermediary bank.",
          "Censorship Resistant: No bank or institution can freeze, block, or cancel your account.",
          "Satoshi Nakamoto: An anonymous cryptographic pioneer of financial liberty."
        ]
      }
    ],
    quiz: {
      question: "Which major crisis motivated Satoshi Nakamoto to launch the Bitcoin network in 2008/2009?",
      bengaliQuestion: "From which major economic crisis was Bitcoin created in 2008/2009 as an alternative?",
      options: [
        "The World War inflation",
        "The 2008 Core Global Financial Crisis",
        "The Dot-com Bubble crash",
        "The Rise of industrial automation"
      ],
      bengaliOptions: [
        "Hyperinflation following the World War",
        "The 2008 global economic recession (Financial Crisis)",
        "Dot-com bubble crash",
        "Mechanization of the Industrial Revolution"
      ],
      answerIndex: 1,
      explanation: "Satoshi Nakamoto embedded the headline 'The Times 03/Jan/2009 Chancellor on brink of second bailout for banks' in the genesis block, directly pointing to the 2008 financial failures.",
      bengaliExplanation: "Satoshi Nakamoto embedded the headline about bank bailouts in the Genesis Block as concrete proof of banking failures."
    }
  },
  {
    id: 2,
    title: "Blockchain Knowledge",
    bengaliTitle: "Blockchain & Network Knowledge",
    icon: Layers,
    iconColor: "text-blue-400",
    summary: "Demystify blockchain ledgers, understand decentralization nodes, and evaluate various global consensus mechanisms such as Proof of Work and Proof of Stake.",
    bengaliSummary: "Demystify the blockchain ledger, the core components of decentralization, and compare consensus mechanisms like Proof of Work and Proof of Stake.",
    topics: [
      {
        id: "2.1",
        title: "How Blockchain and Smart Contracts Work",
        bengaliTitle: "How Blockchain & Smart Contracts Work",
        description: "A blockchain is a chronological chain of cryptographically locked data blocks shared across thousands of computer nodes. Smart contracts are self-executing digital agreements that operate automatically when pre-defined conditions are met.",
        bengaliDescription: "A blockchain is a chain or sequence of data locked with cryptography scattered across thousands of computers worldwide. Smart contracts are self-executing agreements that run automatically when pre-defined conditions are met.",
        bullets: [
          "Cryptographed Blocks: Interlocked hashing where modifying past records requires infinite energy.",
          "Decentralized Nodes: Parallel ledger verification across global physical network servers.",
          "Smart Contracts: Programmable financial code designed to enforce trustless interactions."
        ],
        bengaliBullets: [
          "Cryptographic Blocks: Interlocked data blocks where altering past records is virtually impossible.",
          "Decentralized Nodes: Verification method for ledger balances across globally distributed computers.",
          "Smart Contracts: Programmed automated contracts that eliminate the need to blindly trust anyone."
        ]
      },
      {
        id: "2.2",
        title: "Consensus Mechanisms & Tokens vs Coins",
        bengaliTitle: "Consensus Mechanisms & Coins vs Tokens",
        description: "Decentralized networks agree on balances via consensus algorithms. Proof of Work (PoW) relies on high physical mining computations. Proof of Stake (PoS) relies on locked capital assets. Coins represent native chains, whereas Tokens are applications on top.",
        bengaliDescription: "Consensus is used so that everyone in the network can agree. A coin is a blockchain's native asset (such as BTC), while a token is built on top of another chain (such as VERSE).",
        bullets: [
          "Proof of Work: Highly secure thermodynamic defense requiring immense processor math solver rigs.",
          "Proof of Stake: Fast, clean consensus relying on validator validation stakes.",
          "Layer 1 Coins: Native gas-fee blockchain assets such as Bitcoin or Ethereum."
        ],
        bengaliBullets: [
          "Proof of Work: High mathematical power security system maintained by miners.",
          "Proof of Stake: Fast and eco-friendly system where validators lock specific tokens to participate.",
          "Layer-1 Coins: Native assets used to pay transaction fees or gas, like Ether or Bitcoin."
        ]
      }
    ],
    quiz: {
      question: "What is the critical structural difference between a 'Coin' and a 'Token' in blockchain tech?",
      bengaliQuestion: "What is the primary difference between a 'Coin' and a 'Token' in blockchain technology?",
      options: [
        "Coins are physical gold while tokens are digital codes",
        "Coins have their own native L1 blockchain; Tokens run on an existing third-party L1 chain",
        "Tokens are only used for games, coins are only used in retail shopping",
        "There is no difference between them, they are identical"
      ],
      bengaliOptions: [
        "Coins are physical gold while tokens are digital codes",
        "Coins have their own active L1 blockchain; tokens run on an existing blockchain built by others",
        "Tokens only run in gaming and coins only work in shopping malls",
        "There is no difference, both are exactly identical"
      ],
      answerIndex: 1,
      explanation: "A native Coin operates on its own Layer-1 network (e.g., BTC, ETH), whereas a Token leverages smart contracts hosted on a pre-existing host chain (such as Polygon or Ethereum).",
      bengaliExplanation: "A coin has its own independent virtual network (the railroad tracks), while a token is built as custom cars riding on another's tracks."
    }
  },
  {
    id: 3,
    title: "The Verse Ecosystem",
    bengaliTitle: "The World of Verse Ecosystem",
    icon: Coins,
    iconColor: "text-teal-400",
    summary: "Deep dive into the Verse Ecosystem, understanding the VERSE Token, the Decentralized Exchange (DEX), community utility, and the roadmap to financial democratization.",
    bengaliSummary: "Learn in detail about the Verse Ecosystem, VERSE utility token, Decentralized Exchange (DEX), and the goal of bringing financial opportunities to everyone.",
    topics: [
      {
        id: "3.1",
        title: "Introduction & Mission of Verse",
        bengaliTitle: "Introduction & Philosophy of Verse Ecosystem",
        description: "Created by Bitcoin.com, the Verse ecosystem represents a gateway designed to onboard millions of users into Decentralized Finance (DeFi) without friction, heavy fees, or intimidating entry barriers.",
        bengaliDescription: "Created by Bitcoin.com, 'Verse' is a safe, entirely digital gateway to onboard everyday users into Decentralized Finance (DeFi) seamlessly.",
        bullets: [
          "Financial Freedom: Empowering individuals with decentralized access to financial services worldwide.",
          "User-First Design: Focusing on making complex dApp interactions intuitive for everyday web users.",
          "VERSE Token: The native programmatic coordinate driving incentives, swaps, staking, and participation."
        ],
        bengaliBullets: [
          "Financial Freedom: The right to fully independent transactions outside traditional banking from anywhere.",
          "Simple Design: Making complex blockchain transactions extremely straightforward for everyday users.",
          "VERSE Token: The main driving force used in staking funds, incentive rewards, and all ecosystem activities."
        ]
      },
      {
        id: "3.2",
        title: "Verse DEX, Staking, and Dynamic Utility",
        bengaliTitle: "Verse DEX & Staking Utility",
        description: "The Verse Decentralized Exchange allows continuous peer-to-peer trading without broker custody. Staking pools enable token holders to earn interest rewards, while community launchpads fund next-generation innovators.",
        bengaliDescription: "Verse Decentralized Exchange helps swap directly wallet-to-wallet without intermediaries. Staking allows locking VERSE to earn passive rewards.",
        bullets: [
          "Verse DEX: Highly secured AMM protocol allowing instantaneous swaps under personal control.",
          "Yield Farms & Liquidity: Providing asset pairs to earn swap fees dynamically alongside bonuses.",
          "Buyback & Deflation: Strategic treasury operations which burn tokens over time to reduce supply."
        ],
        bengaliBullets: [
          "Verse DEX: Extremely secure instant swapping exchange operated by directly connecting personal wallets.",
          "Yield Farms & Liquidity: Opportunity to earn a share of trading fees and bonuses by providing asset liquidity pairs.",
          "Buyback & Burning: Periodically buying back and burning tokens to progressively reduce circulating supply."
        ]
      }
    ],
    quiz: {
      question: "Which of the following is a primary function of the Verse Decentralized Exchange (DEX)?",
      bengaliQuestion: "What is the primary function of the Verse Decentralized Exchange (DEX)?",
      options: [
        "Trading physical commodities like gold and oil",
        "Enabling seamless peer-to-peer crypto swaps directly from user-custodied wallets",
        "Managing central bank fiat currencies",
        "Hosting centralized bank accounts for high net worth clients"
      ],
      bengaliOptions: [
        "Wholesale trading of physical gold, oil, or mineral resources",
        "Instant swapping of crypto directly from your wallet without any intermediary",
        "Operating official central bank fiat currencies",
        "Opening massive central bank accounts for wealthy billionaires"
      ],
      answerIndex: 1,
      explanation: "Verse DEX is specialized in automated non-custodial decentralized peer-to-peer asset token swapping, keeping security fully. This ensures you maintain ownership of your assets.",
      bengaliExplanation: "In Verse DEX, the complete custody of your funds is retained in your own wallet; the exchange never stores your crypto assets."
    }
  },
  {
    id: 3,
    title: "The Verse Ecosystem",
    bengaliTitle: "The World of Verse Ecosystem",
    icon: Coins,
    iconColor: "text-teal-400",
    summary: "Deep dive into the Verse Ecosystem, understanding the VERSE Token, the Decentralized Exchange (DEX), community utility, and the roadmap to financial democratization.",
    bengaliSummary: "Learn in detail about the Verse Ecosystem, VERSE utility token, Decentralized Exchange (DEX), and the goal of bringing financial opportunities to everyone.",
    topics: [
      {
        id: "3.1",
        title: "Introduction & Mission of Verse",
        bengaliTitle: "Introduction & Philosophy of Verse Ecosystem",
        description: "Created by Bitcoin.com, the Verse ecosystem represents a gateway designed to onboard millions of users into Decentralized Finance (DeFi) without friction, heavy fees, or intimidating entry barriers.",
        bengaliDescription: "Created by Bitcoin.com, 'Verse' is a safe, entirely digital gateway to onboard everyday users into Decentralized Finance (DeFi) seamlessly.",
        bullets: [
          "Financial Freedom: Empowering individuals with decentralized access to financial services worldwide.",
          "User-First Design: Focusing on making complex dApp interactions intuitive for everyday web users.",
          "VERSE Token: The native programmatic coordinate driving incentives, swaps, staking, and participation."
        ],
        bengaliBullets: [
          "Financial Freedom: The right to fully independent transactions outside traditional banking from anywhere.",
          "Simple Design: Making complex blockchain transactions extremely straightforward for everyday users.",
          "VERSE Token: The main driving force used in staking funds, incentive rewards, and all ecosystem activities."
        ]
      },
      {
        id: "3.2",
        title: "Verse DEX, Staking, and Dynamic Utility",
        bengaliTitle: "Verse DEX & Staking Utility",
        description: "The Verse Decentralized Exchange allows continuous peer-to-peer trading without broker custody. Staking pools enable token holders to earn interest rewards, while community launchpads fund next-generation innovators.",
        bengaliDescription: "Verse Decentralized Exchange helps swap directly wallet-to-wallet without intermediaries. Staking allows locking VERSE to earn passive rewards.",
        bullets: [
          "Verse DEX: Highly secured AMM protocol allowing instantaneous swaps under personal control.",
          "Yield Farms & Liquidity: Providing asset pairs to earn swap fees dynamically alongside bonuses.",
          "Buyback & Deflation: Strategic treasury operations which burn tokens over time to reduce supply."
        ],
        bengaliBullets: [
          "Verse DEX: Extremely secure instant swapping exchange operated by directly connecting personal wallets.",
          "Yield Farms & Liquidity: Opportunity to earn a share of trading fees and bonuses by providing asset liquidity pairs.",
          "Buyback & Burning: Periodically buying back and burning tokens to progressively reduce circulating supply."
        ]
      }
    ],
    quiz: {
      question: "Which of the following is a primary function of the Verse Decentralized Exchange (DEX)?",
      bengaliQuestion: "What is the primary function of the Verse Decentralized Exchange (DEX)?",
      options: [
        "Trading physical commodities like gold and oil",
        "Enabling seamless peer-to-peer crypto swaps directly from user-custodied wallets",
        "Managing central bank fiat currencies",
        "Hosting centralized bank accounts for high net worth clients"
      ],
      bengaliOptions: [
        "Wholesale trading of physical gold, oil, or mineral resources",
        "Instant swapping of crypto directly from your wallet without any intermediary",
        "Operating official central bank fiat currencies",
        "Opening massive central bank accounts for wealthy billionaires"
      ],
      answerIndex: 1,
      explanation: "Verse DEX is specialized in automated non-custodial decentralized peer-to-peer asset token swapping, keeping security fully. This ensures you maintain ownership of your assets.",
      bengaliExplanation: "In Verse DEX, the complete custody of your funds is retained in your own wallet; the exchange never stores your crypto assets."
    }
  },
  {
    id: 4,
    title: "Bitcoin.com Ecosystem",
    bengaliTitle: "Bitcoin.com Ecosystem",
    icon: Globe,
    iconColor: "text-sky-400",
    summary: "Learn about the multi-million user Bitcoin.com Wallet infrastructure, self-custody principles, backup seed phrases, and interacting with Web3 applications safely.",
    bengaliSummary: "Learn about the trusted Bitcoin.com Wallet infrastructure trusted by millions, the secrets of self-custody keys, backup seed phrases, and browsing Web3 safely.",
    topics: [
      {
        id: "4.1",
        title: "Bitcoin.com Wallet & Self-Custody Core",
        bengaliTitle: "Bitcoin.com Wallet & Self-Custody Core",
        description: "The multi-chain Bitcoin.com Wallet acts as your individual self-custodial vault. In self-custody, you own the 12-word seed phrase (private keys). If lost, no bank, support agent, or central server can recover it.",
        bengaliDescription: "The Bitcoin.com Wallet is your personal secure digital locker. Its private key or 12-word recovery seed phrase is held only by you. If lost, your entire asset balance is lost forever.",
        bullets: [
          "Your Keys, Your Crypto: Holding absolute power over your digital assets; no external bans.",
          "12-Word Recovery Phrase: The master mathematical key generated purely in local device chips.",
          "Secure Backups: Cloud-encrypted backup channels or bulletproof offline physical paper storage."
        ],
        bengaliBullets: [
          "Your Keys, Your Crypto: Complete 100% ownership over your assets; no middleman can freeze them.",
          "12-Word Backup Phrase: A mathematical recovery master key generated completely offline on your device.",
          "Secure Backup: Reliable offline storage in writing or password-secured electronic form."
        ]
      },
      {
        id: "4.2",
        title: "Web3 Interactions & Best Security Practices",
        bengaliTitle: "Web3 Best Security Practices",
        description: "Modern wallets connect users to the decentralized web. You can access swap tools, launchpads, yield generators, and explore the global digital financial network directly inside the Bitcoin.com interface.",
        bengaliDescription: "Modern crypto wallets enable direct browsing of the Web3 world, connecting to DEX platforms, viewing NFT collections, and accumulating Verse rewards through staking.",
        bullets: [
          "DeFi Bridges: Sending and swapping tokens inside built-in, lightning-fast multi-network systems.",
          "Phishing Defense: Verifying domain URL links, never inputting seed phrases on external websites.",
          "Hardware Wallets: Moving life-savings assets into cold, completely isolated physical chips."
        ],
        bengaliBullets: [
          "DeFi Bridge: Easily and rapidly swap crypto across multiple blockchain networks inside the wallet.",
          "Phishing Caution: Always verify correct URLs and never reveal your secret backup key on any website link.",
          "Hardware Wallet: Moving significant long-term funds to completely offline physical cold storage chips."
        ]
      }
    ],
    quiz: {
      question: "What happens if you input your 12-word Wallet recovery seed phrase onto a questionable website?",
      bengaliQuestion: "What will happen if you input your 12-word wallet backup recovery phrase onto a phishing website?",
      options: [
        "Your wallet will upgrade to premium VIP status",
        "You will immediately get bonus Verse tokens",
        "Malicious parties will fully gain entry to your seed and empty all your digital wallet assets",
        "Nothing, the bank will automatically block suspicious transactions"
      ],
      bengaliOptions: [
        "Your wallet will upgrade to premium VIP status",
        "You will immediately get bonus tokens",
        "Hackers or malicious entities will get your master key and empty all your digital assets in seconds",
        "A central bank will automatically step in to block any unauthorized transactions"
      ],
      answerIndex: 2,
      explanation: "Any entity that obtains your 12-word phrase gains physical master clearance to your deposits immediately. Never share it with anyone under any circumstances.",
      bengaliExplanation: "The 12 words form the master key of your vault. Anyone who obtains them will instantly own your funds under automatic blockchain rules."
    }
  },
  {
    id: 5,
    title: "Web2 to Web3 Evolution",
    bengaliTitle: "Web2 to Web3 Evolution",
    icon: Compass,
    iconColor: "text-purple-400",
    summary: "Contrast the three eras of the internet: Web1 (Read), Web2 (Read-Write/Monopolized), and Web3 (Read-Write-Own/Decentralized) driven by cryptographic digital rights.",
    bengaliSummary: "Compare the three eras of the internet: Web1 (read-only), Web2 (dynamic but centralized monetization), and Web3 (full digital ownership and decentralized governance).",
    topics: [
      {
        id: "5.1",
        title: "Tracing Internet Eras: Web1, Web2, and Web3",
        bengaliTitle: "The Three Eras of the Internet: Web1, 2 & 3",
        description: "The internet evolved from a static read-only database system (Web1), to a massive social-interactive advertising giant hosted by conglomerates (Web2). Web3 replaces these monopolistic models with user ownership.",
        bengaliDescription: "Over the past 30 years, the internet has evolved massively. Web1 was read-only, Web2 is interactive but driven by centralized silos (Facebook, Google), while Web3 returns data ownership to the users.",
        bullets: [
          "Web1 Era (Read): Static text pages, email protocols, and basic informational directories.",
          "Web2 Era (Read-Write): Interactive media platforms monetizing user behaviors and trading user data.",
          "Web3 Era (Read-Write-Own): Completely autonomous protocol ecosystems powered by cryptography."
        ],
        bengaliBullets: [
          "Web1 Era: Static text pages and early email communication methods.",
          "Web2 Era: Social media platforms where tech giants monetize the user data you generate.",
          "Web3 Era: Direct user ownership, data sovereignty, and voting rights in protocols."
        ]
      },
      {
        id: "5.2",
        title: "Digital Ownership & dApps Architecture",
        bengaliTitle: "Digital Ownership & Decentralized Apps",
        description: "Decentralized applications (dApps) replace traditional servers with distributed smart contracts. Rather than logging in with Google or meta passwords, you prove residency using web3 wallet signatures.",
        bengaliDescription: "Decentralized applications (dApps) do not reside on a single central server. They run on decentralized blockchains. Users can connect directly via cryptographic wallet signatures to log in.",
        bullets: [
          "Single Sign-On: Wallet-based unified cryptographic identities protecting web privacy.",
          "Data Sovereign: Personal interactions remain protected, eliminating tracking scripts.",
          "Decentralized Apps: Peer-to-peer network solutions that remain permanently active."
        ],
        bengaliBullets: [
          "Single Sign-On: Password-less, fully secure digital identity authorization via wallet signatures.",
          "Data Sovereignty: Protecting browsers and personal messages from snooping advertisers.",
          "dApps Design: Permanent, independent internet solutions with zero risk of central shutdowns."
        ]
      }
    ],
    quiz: {
      question: "Which of the following phrases represents the fundamental empowerment definition of Web3?",
      bengaliQuestion: "Which of the following slogans represents the fundamental power of Web3?",
      options: [
        "Click to Buy and Charge Cards",
        "Read, Write, and cryptographic Ownership (Read-Write-Own)",
        "Read-Only physical text printout online",
        "Centralized validation of web browsers"
      ],
      bengaliOptions: [
        "Click to buy and charge digital credit cards",
        "Read, Write, and cryptographic Ownership (Read-Write-Own)",
        "Only reading static web pages online",
        "Surveillance of web browsers"
      ],
      answerIndex: 1,
      explanation: "Web3 goes beyond writing dynamic data to servers; it introduces complete programmatic user ownership of assets, avatars, profiles, and digital files. This is verified openly.",
      bengaliExplanation: "Web3 is not limited to reading and writing data; blockchain securely restores ownership of wealth and identity to the end users."
    }
  },
  {
    id: 6,
    title: "Digital Economy & AI Convergence",
    bengaliTitle: "ডিজিটাল অর্থনীতি ও প্রযুক্তির যুগলবন্দি",
    icon: Cpu,
    iconColor: "text-amber-500",
    summary: "Envision the ongoing global digital transformation merging artificial intelligence, smart automated services, metaverse environments, and crypto economic layer boundaries.",
    bengaliSummary: "আর্টিফিশিয়াল ইন্টেলিজেন্স বা এআই, মেটাভার্স ভার্চুয়াল জগত এবং ব্লকচেইনের আর্থিক মেলবন্ধনে গড়ে ওঠা আগামী দিনের বৈশ্বিক ডিজিটাল ট্রান্সফরমেশন উন্মোচন করুন।",
    topics: [
      {
        id: "6.1",
        title: "Artificial Intelligence & Decentralized Ledgers",
        bengaliTitle: "আর্টিফিশিয়াল ইন্টেলিজেন্স ও ব্লকচেইনের যৌথ ক্ষমতা",
        description: "AI brings incredibly high-speed cognitive decision power, while block ledgers bring complete audit transparency and security. Together, blockchain enables AI entities to transact resources transparently without centralized bias.",
        bengaliDescription: "এআই বিশ্লেষণ করে চমৎকার সিদ্ধান্ত নিতে পারে, অন্যদিকে ব্লকচেইনে থাকে স্বচ্ছতা ও নিরাপত্তা। ব্লকচেইন প্রযুক্তির দ্বারা এআই তার স্বয়ংক্রিয় লজিক বা চার্জ ক্রিপ্টোর মাধ্যমে পেমেন্ট করতে পারে।",
        bullets: [
          "Agentic Financial System: Autonomous AI entities exchanging network resources via micropayments.",
          "Tamper-proof Metadata: Tracking generative AI training assets to prevent deep-fake frauds.",
          "Distributed Model Networks: Hosting AI capabilities in neural clusters without physical master nodes."
        ],
        bengaliBullets: [
          "এআই ব্যাংকিং: মানুষের হস্তক্ষেপ ছাড়াই এআই এজেন্টরা স্বয়ংক্রিয় মাইক্রোপেমেন্টের কাজ করতে পারে।",
          "ফেক ডেটা সনাক্তকরণ: ব্লকচেইনে তথ্য রেজিস্ট্রি করে ভুয়া তথ্য ছড়ানো থেকে বাঁচার চমৎকার হাতিয়ার।",
          "বিকেন্দ্রীভূত এআই মডেল: কেন্দ্রীভূত সার্ভারের বাইরে পুরো ইন্টারনেটের ফ্রেমওয়ার্ক জুড়ে কৃত্রিম বুদ্ধিমত্তা।"
        ]
      },
      {
        id: "6.2",
        title: "The Multiverse & Next-Generation Financial Infrastructure",
        bengaliTitle: "মেটাভার্স এবং আগামী শতাব্দীর আর্থিক ব্যবস্থা",
        description: "A digital virtual economy requires trustless assets that can move seamlessly across metaverses. Central bank digital currencies (CBDCs) and globally tokenized assets are shaping a borderless financial reality.",
        bengaliDescription: "ভার্চুয়াল পৃথিবী বা মেটাভার্সে এমন সম্পদ প্রয়োজন যা কোন প্রতিষ্ঠানের সীমানায় আটকে থাকবে না। গ্লোবাল টোকেন এবং ডিজিটাল ফাইন্যান্স আগামীতে বিশ্ব অর্থনীতি পাল্টে দেবে।",
        bullets: [
          "Metaverse Commerce: Trading virtual properties and items represented as verifiable NFTs.",
          "Tokenized Securities: Fractional real-estate, artwork, and market indices on-chain.",
          "Unified Global Trade: Settling invoices in split seconds at 99% less overhead costs than SWIFT."
        ],
        bengaliBullets: [
          "মেটাভার্স বাণিজ্য: কাস্টম ভার্চুয়াল সম্পত্তি বা ঘরের মালিকানা এনএফটি (NFT) হিসেবে ধারণ।",
          "টোকেনাইজড সোনা ও সম্পদ: বাস্তব রিয়েল এস্টেট, জমি বা সোনা ভগ্নাংশ আকারে ক্রিপ্টোতে বেচাকেনা।",
          "সীমানাহীন ক্রেডিট: সুইফট সার্ভার ছাড়াই মাত্র কয়েক সেকেন্ডে কম খরচে আন্তর্জাতিক পেমেন্ট নিস্পত্তি।"
        ]
      }
    ],
    quiz: {
      question: "How does Blockchain aid Generative Artificial Intelligence (AI) safety?",
      bengaliQuestion: "ব্লকচেইন কিভাবে জেনারেটিভ আর্টিফিশিয়াল ইন্টেলিজেন্স (AI) এর নিরাপত্তায় সাহায্য করে?",
      options: [
        "By making computer processors run faster",
        "By hosting cryptographic timestamps and records of clean training sets to verify output origins and combat deepfakes",
        "By replacing the human brain inside physical robots",
        "By automatically translating code language to traditional scripts"
      ],
      bengaliOptions: [
        "কম্পিউটারের ফিজিক্যাল প্রসেসরের গতি বাড়িয়ে তোলার মাধ্যমে",
        "সঠিক ছবির প্রমাণ ও ক্রিপ্টোগ্রাফিক টাইমস্ট্যাম্প রেখে ডেটার উৎস বা ডিপফেক সনাক্তকরণ সহজ করে",
        "বাস্তব রোবটের ভেতরকার হিউম্যান ব্রেইনকে সরাসরি রিপ্লেস করে ফেলে",
        "প্রোগ্রামিং কোডগুলোকে স্বয়ংক্রিয়ভাবে কাগুজে ভাষাতে ডিক্রিপ্ট করার দ্বারা"
      ],
      answerIndex: 1,
      explanation: "By logging the cryptographically signed source data of original records onto a trusted blockchain ledger, users can confirm actual asset origins and mitigate generative model fraud.",
      bengaliExplanation: "ব্লকচেইনে কোনো তথ্য সংরক্ষণ করলে তার রচয়িতা বা প্রকৃত ডেটা কখন ক্যামেরা থেকে ধারণ করা তা সহজেই চাবি দিয়ে প্রমাণ করা যায়, ফলে গুজব ছড়ানো হ্রাস পায়।"
    }
  },
  {
    id: 7,
    title: "Community & DAOs Development",
    bengaliTitle: "ডিজিটাল সমাজ এবং ডিএও (DAO) এর বিকাশ",
    icon: Users,
    iconColor: "text-emerald-400",
    summary: "Analyze the social core of decentralized web networks: community governance, decentralized autonomous organizations (DAOs), and modern global collaboration strategies.",
    bengaliSummary: "বিকেন্দ্রীভূত ওয়েবের আসল চালিকাশক্তি—ডিজিটাল সমাজ শাসন পদ্ধতি, ডিসেন্ট্রালাইজড অটোনমাস অর্গানাইজেশন বা ডিএও এবং বৈশ্বিক কোলাবোরেশন ও নেতৃত্ব কৌশল উন্মোচন করুন।",
    topics: [
      {
        id: "7.1",
        title: "Decentralized Autonomous Organizations (DAOs)",
        bengaliTitle: "ডিএও (DAO) বা বিকেন্দ্রীভূত স্বায়ত্ত্বশাসিত সংস্থা",
        description: "A DAO is a community-owned, software-governed collective with its rules encoded as transparent smart contracts. Rather than trusting a bureaucratic board of directors, proposal execution is directly decided by token votes.",
        bengaliDescription: "ডিএও (DAO) হল এমন এক কোম্পানি বা ডিজিটাল দল যার পরিচালক কোনো একজন ব্যক্তি নন। নিয়মগুলো থাকে ব্লকচেইনে প্রোগ্রাম করা এবং যেকোনো সিদ্ধান্ত বা ফান্ডের বরাদ্দ সরাসরি টোকেন ভোটের মাধ্যমে নির্ধারিত হয়।",
        bullets: [
          "Flat Governance: Eliminating high executive boards, providing every single holder an equal voice.",
          "Smart Contract Treasury: Funds unlock only if cryptographic voting consensus is verified mathematically.",
          "Dynamic Propositions: Submitting improvements and modifications directly into public proposal queues."
        ],
        bengaliBullets: [
          "সমতার শাসন: কোনো পর্ষদ বা চেয়ারম্যান না রেখে টোকেন হোল্ডারদের ভোটের ক্ষমতায় অংশীদারিত্ব।",
          "স্মার্ট কন্ট্রাক্ট ট্রেজারি: তহবিল কেবল তখনই রিলিজ হবে যখন গাণিতিক মেজরিটি ভোট সম্পন্ন হবে।",
          "পাবলিক প্রপোজালস: ইকোসিস্টেমের উন্নতির জন্য সরাসরি যে কেউ প্রপোজাল জমা দিতে পারে।"
        ]
      },
      {
        id: "7.2",
        title: "Decentralized Collaboration & Multi-Network Scaling",
        bengaliTitle: "যৌথ শক্তি এবং টেকসই নেটওয়ার্কের প্রসার",
        description: "Decentralized communities act as organic human coordinate structures. When aligned with open-source systems, global talent pools can unite to construct resilient, self-funding financial networks.",
        bengaliDescription: "সারা পৃথিবীর প্রোগ্রামার ও ফ্রিল্যান্সাররা একসাথে মিলিত হয়ে বড় বড় ওপেন সোর্স প্রজেক্ট তৈরি করে ফেলেন। এটি সম্ভব হয়েছে ক্রিপ্টো ইকোসিস্টেমের চমৎকার ইনসেনটিভ ও আর্থিক বিপ্লবের মাধ্যমে।",
        bullets: [
          "Permissionless Contributions: Anyone with an internet hook can design, write code, or create content.",
          "Incentive Alignment: Rewarding creators with utility tokens automatically for verified metrics.",
          "Sustainable Roadmap: Creating self-funding public utilities that do not require venture monopoly greed."
        ],
        bengaliBullets: [
          "সবার উন্মুক্ত সুযোগ: যার কাছে ইন্টারনেট বা ল্যাপটপ আছে সেই অবদান রেখে ক্রিপ্টো আয় করতে পারে।",
          "ইনসেনটিভ রিওয়ার্ড: টোকেনের সঠিক ব্যবহারের মাধ্যমে অবদানকারীদের স্বয়ংক্রিয়ভাবে লাভবান করা।",
          "জনমুখী অর্থনীতি: বড় পুঁজিপতিদের মুনাফার লোভে আক্রান্ত না হয়ে জনগণের অধীনে নেটওয়ার্ক বিকশিত করা।"
        ]
      }
    ],
    quiz: {
      question: "Which aspect makes a DAO different from a traditional corporate company?",
      bengaliQuestion: "ঐতিহ্যবাহী কর্পোরেট বড় কোম্পানির তুলনায় একটি ডিএও (DAO) এর সবচেয়ে বড় অমিল বা অভিনবত্ব কোনটি?",
      options: [
        "DAOs require employees to work 24 hours a day",
        "Decisions and fund transfers are ruled transparently by smart contracts and token-holder votes instead of a centralized CEO",
        "DAOs only accept printed paper physical currencies",
        "DAOs do not use the internet to coordinate projects"
      ],
      bengaliOptions: [
        "ডিএও মেম্বারদের ২৪ ঘণ্টাই একনাগাড়ে পরিশ্রম করতে বাধ্য করে",
        "আইন ও তহবিল বন্টন সরাসরি স্মার্ট কন্ট্রাক্ট এবং টোকেন হোল্ডারদের স্বচ্ছ ভোটের মাধ্যমে নির্ধারিত হয়—কোন এক সিইও বা চেয়ারম্যানের ইচ্ছায় নয়।",
        "ডিএও কেবল প্রচলিত কাগুজে টাকা দিয়ে ব্যবসা সামলায়",
        "ডিএও কাজ পরিচালনার জন্য ইন্টারনেটের কোনো সাহায্য নেয় না"
      ],
      answerIndex: 1,
      explanation: "Under a DAO framework, rules are embedded as readable smart contracts. No manager can modify treasury flows unilaterally without reaching structural consensus inside the community.",
      bengaliExplanation: "ডিএওতে কোনো সিইও একা দাঁড়িয়ে কোম্পানির ফান্ড নিজের ব্যক্তিগত ব্যাংক অ্যাকাউন্টে সরাতে পারবে না, ফান্ড বের করতে চাইলে পর্যাপ্ত ভোটের ঐক্য ব্লকচেইনে জমা পড়তে হবে।"
    }
  }
];

// GLOSSARY DATABASE
const GLOSSARY_TERMS = [
  { term: "Address", def: "A cryptographic string containing numbers and letters that acts as a destination for sending and receiving transaction tokens.", bgDef: "একটি ক্রিপ্টোগ্রাফিক কোড বা ঠিকানা যা নেটওয়ার্কে ক্রিপ্টোকারেনসি লেনদেনের গন্তব্য হিসেবে কাজ করে।" },
  { term: "AMM (Automated Market Maker)", def: "A type of decentralized exchange protocol that relies on mathematical mathematical formulas to value assets instead of central order books.", bgDef: "এক প্রকার ডিসেন্ট্রালাইজড এক্সচেঞ্জ প্রযুক্তি যা সাধারণ বায়ার এবং সেলারের সরাসরি অর্ডার ম্যাচ না করে ম্যাথমেটিক্যাল ফর্মুলার উপর এসেট ট্রেড করে।" },
  { term: "Block", def: "A structural data file containing list transactions that have been verified, locked, and appended irreversibly on-chain.", bgDef: "একটি ডেটা ফাইল যেখানে ভ্যালিডেট হওয়া আর্থিক লেনদেনগুলো সুনির্দিষ্টভাবে ক্রিপ্টোগ্রাফি দিয়ে চেইন ফাইলে লক করা থাকে।" },
  { term: "Burn", def: "Permanently removing tokens from circulation by sending them to an un-spendable null address, decreasing the overall circulating supply.", bgDef: "টোকেন স্থায়ীভাবে বাজার থেকে অপসারণ করে ধ্বংস করা, যার ফলে মোট সরবরাহ কমে মূল্য বৃদ্ধির সম্ভাবনা বাড়ে।" },
  { term: "DEX (Decentralized Exchange)", def: "A peer-to-peer exchange platform owned by smart contracts where users swap tokens directly, keeping full wallet custody.", bgDef: "এমন এক ডিজিটাল সোয়াপ ট্রাস্টলেস এক্সচেঞ্জ প্ল্যাটফর্ম যেখানে কারোর মধ্যস্থতার অপেক্ষা না রেখেই ওয়ালেট কানেক্ট করে সোয়াপ করা সম্ভব।" },
  { term: "Gas Fee", def: "The technical price or transaction fee paid to network miners or validation services to process digital records onto the blockchain.", bgDef: "লেনদেনটি ব্লকচেইনে নিশ্চিত ও ক্রিপ্টো ব্লকে অন্তর্ভুক্ত করার জন্য মাইনার বা ভ্যালিডিটরকে যে ফিসটি প্রদান করতে হয়।" },
  { term: "Hardware Wallet", def: "A offline physical device (USB-like) that acts as cold storage to protect private seed keys away from internet network hackers.", bgDef: "একটি ফিজিক্যাল ইলেকট্রনিক চিপ ডিভাইস যা চাবিকে ইন্টারনেট বা ব্রাউজার জগৎ থেকে সম্পূর্ণ বিচ্ছিন্ন বা অফলাইনে নিরাপদে রাখে।" },
  { term: "Liquidity Pool", def: "A crowdsourced pile of token funds locked in a smart contract that facilitates decentralized trading swaps inside DEX models.", bgDef: "একজোড়া ক্রিপ্টো এসেট তহবিল যা স্মার্ট কন্ট্রাক্টে গচ্ছিত রাখা হয় যাতে মানুষ তৎক্ষণাৎ স্বয়ংক্রিয়ভাবে সোয়াপ লেনদেন সম্পন্ন করতে পারে।" },
  { term: "Private Key", def: "The highly hidden cryptographic code phrase that grants direct entry and power of disposal over any associated crypto wallet assets.", bgDef: "অত্যন্ত গোপনীয় একটি ডিজিটাল চাবিকাঠি যা কোনো ওয়ালেটের মালিকানা প্রমাণ করে এবং ফান্ড খরচ করার অনুমতি দেয়।" },
  { term: "Slippage", def: "The difference in value of cryptocurrency tokens between the exact checkout moment you send a trade and the instant the smart contract confirms it.", bgDef: "ট্রেড সাবমিট ও কনফার্ম হওয়ার মধ্যবর্তী সময়ে মার্কেট প্রাইস দ্রুত কম বা বেশি হওয়ার কারণে মূল্যের যে সূক্ষ্ম ফারাক তৈরি হয়।" },
  { term: "Staking", def: "Locking financial crypto tokens into a validator contract to secure network operations in exchange for yield payouts.", bgDef: "একটি স্মার্ট কন্ট্রাক্টে ক্রিপ্টো জমা রেখে নেটওয়ার্ক সুরক্ষায় শামিল হওয়ার বিনিময়ে রিওয়ার্ড বা সুদ লাভ করার পদ্ধতি।" },
  { term: "Seed Phrase", def: "A master list of 12 or 24 readable random words generated by a wallet that mathematically derives all private keys and asset balances.", bgDef: "১২ বা ২৪ শব্দের অত্যন্ত প্রফিট মাস্টার কি, যা দিয়ে মোবাইল হারিয়ে গেলেও অন্য নতুন ডিভাইসে পুরো ওয়ালেট ফিরিয়ে আনা যায়।" }
];

// FAQS DATABASE
const FAQ_LIST = [
  { q: "Is Verse Ecosystem Book a real interactive book? / এটি কি ইন্টারঅ্যাক্টিভ বই?", a: "Yes. It has been structured exactly like a real textbook, containing progressive Chapters, detailed Subtopics, Diagrams/Infographics, A-Z Glossary search, Timelines, Checkable Reading Progress, and Chapter Quizzes with real gamified coin triggers.", bgA: "হ্যাঁ। এটি একটি পূর্ণাঙ্গ ডিজিটাল বুক এর মত ডিজাইন করা হয়েছে—যেখানে চ্যাপ্টার, সুন্দর ব্লক ডায়াগ্রাম, ড্যাপস ডেমো, এ-জেড গ্লোসারি রকিং বুকমার্কস এবং শেষ ধাপে বোনাস কয়েন অর্জনের জন্য চ্যাপ্টার কুইজ সিস্টেম অন্তর্ভুক্ত করা হয়েছে।" },
  { q: "What is self-custody? How do I backup my Bitcoin.com wallet? / সেলফ-কাস্টডি কি ও কিভাবে ব্যাকআপ রাখব?", a: "Self-custody means you are the sole director of your assets. The Bitcoin.com wallet does not store passwords on private servers. You must physically write down your 12-word seed recovery passphrase and keep it safe from anyone.", bgA: "সেলফ-কাস্টডি মানে হল আপনার টাকা কেবল আপনারই অধীনে। বিটকয়েন ডট কম আপনার চাবি কোনো কোম্পানির সার্ভারে জমা রাখে না। তাই নিজের ১২ শব্দের কোডটি একটি ডায়েরিতে সুন্দর করে লিখে গোপন সিন্দুকে রেখে দিন।" },
  { q: "How can I earn rewards while studying this complete Ecosystem Book? / পড়ার সাথে ইনকামের সুযোগ কি?", a: "Every chapter contains a Chapter Quiz. Correctly solving a chapter's quiz grants you points, and completing all quizzes successfully awards a substantial learning token payout directly to your app coins bank!", bgA: "প্রতিটি চ্যাপ্টার শেষ করার সময় আপনি চ্যাপ্টার কুইজ টেস্ট করার সুযোগ পাবেন। সঠিক কুইজ সমাধান করলেই সাথে সাথে আপনার প্রোফাইলে বোনাস পয়েন্ট যুক্ত করা হবে!" }
];

interface VerseEcosystemBookProps {
  onBack: () => void;
  onEarnCoins?: (amount: number) => void;
}

export default function VerseEcosystemBook({ onBack, onEarnCoins }: VerseEcosystemBookProps) {
  // Navigation & View States
  const [readingMode, setReadingMode] = useState<'midnight' | 'paper' | 'slate'>('midnight');
  const [activeTab, setActiveTab] = useState<'book' | 'timeline' | 'glossary' | 'faq'>('book');
  
  // Chapter & Reading States
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [selectedSubTopic, setSelectedSubTopic] = useState<SubTopic | null>(null);
  
  // Bookmarks State
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  
  // Reading progress (list of completed topic ids, e.g. "1.1", "1.2")
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  
  // Quiz states
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [quizScoreCard, setQuizScoreCard] = useState<Record<number, boolean>>({}); // chapterId -> passed
  
  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Glossary Search state
  const [glossarySearch, setGlossarySearch] = useState<string>('');

  // Reward Notification
  const [notification, setNotification] = useState<string | null>(null);

  // Load persistence states on mount
  useEffect(() => {
    // Bookmarks
    const savedBookmarks = safeStorage.getItem('verse_book_bookmarks');
    if (savedBookmarks) {
      try { setBookmarks(JSON.parse(savedBookmarks)); } catch(e) {}
    }
    
    // Completed reading sections
    const savedCompleted = safeStorage.getItem('verse_book_completed');
    if (savedCompleted) {
      try { setCompletedTopics(JSON.parse(savedCompleted)); } catch(e) {}
    }
    
    // Passed quizzes
    const savedQuizScore = safeStorage.getItem('verse_book_quiz_scores');
    if (savedQuizScore) {
      try { setQuizScoreCard(JSON.parse(savedQuizScore)); } catch(e) {}
    }
  }, []);

  // Save states helper
  const updateCompletedTopics = (newList: string[]) => {
    setCompletedTopics(newList);
    safeStorage.setItem('verse_book_completed', JSON.stringify(newList));
  };

  const toggleBookmark = (topicId: string) => {
    let updated: string[];
    if (bookmarks.includes(topicId)) {
      updated = bookmarks.filter(id => id !== topicId);
    } else {
      updated = [...bookmarks, topicId];
      // Micro-glow trigger
      triggerMiniNotification("🔖 Bookmarked! Saved for study.");
    }
    setBookmarks(updated);
    safeStorage.setItem('verse_book_bookmarks', JSON.stringify(updated));
  };

  const triggerMiniNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Mark all topics in current chapter read
  const markCurrentChapterRead = () => {
    const currentChapter = CHAPTERS[currentChapterIndex];
    const topicIds = currentChapter.topics.map(t => t.id);
    const unique = Array.from(new Set([...completedTopics, ...topicIds]));
    updateCompletedTopics(unique);
    triggerMiniNotification("🏆 All Chapter parts marked read successfully!");
  };

  const handleToggleTopicComplete = (topicId: string) => {
    let updated: string[];
    if (completedTopics.includes(topicId)) {
      updated = completedTopics.filter(id => id !== topicId);
    } else {
      updated = [...completedTopics, topicId];
      // Give tiny progress rewards
      if (onEarnCoins) {
        onEarnCoins(5);
        triggerMiniNotification("✨ Progress Checked! Standard 5 Verse Points Credited!");
      } else {
        triggerMiniNotification("✨ Verification checked! Section Read.");
      }
    }
    updateCompletedTopics(updated);
  };

  // Submit quiz answer
  const submitQuizAnswer = (optionIdx: number) => {
    if (quizAnswered) return;
    setSelectedOptionIndex(optionIdx);
    setQuizAnswered(true);

    const activeChapter = CHAPTERS[currentChapterIndex];
    const isCorrect = optionIdx === activeChapter.quiz.answerIndex;

    if (isCorrect) {
      const isAlreadyPassed = quizScoreCard[activeChapter.id];
      if (!isAlreadyPassed) {
        const updatedScores = { ...quizScoreCard, [activeChapter.id]: true };
        setQuizScoreCard(updatedScores);
        safeStorage.setItem('verse_book_quiz_scores', JSON.stringify(updatedScores));

        // Credit larger gamified reward!
        if (onEarnCoins) {
          onEarnCoins(50);
          triggerMiniNotification("🎉 Brilliant! Verified Correct Answer! +50 Verse Points Credited!");
        } else {
          triggerMiniNotification("🎉 Well Done! Understood complete fundamentals.");
        }
      }
    } else {
      triggerMiniNotification("❌ Incorrect, review chapter content and try again!");
    }
  };

  const resetQuiz = () => {
    setQuizAnswered(false);
    setSelectedOptionIndex(null);
  };

  // Calculations for total reading progress
  const totalTopicsCount = CHAPTERS.reduce((acc, chap) => acc + chap.topics.length, 0);
  const readingProgressPercentage = Math.round((completedTopics.length / totalTopicsCount) * 100);

  // Filters for search query
  const filteredChapters = CHAPTERS.filter(chap => {
    const matchChap = chap.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      chap.bengaliTitle.includes(searchQuery);
    const matchTopics = chap.topics.some(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bengaliTitle.includes(searchQuery)
    );
    return matchChap || matchTopics;
  });

  // Reading Mode Styles
  const getThemeStyles = () => {
    return {
      bg: 'bg-white',
      text: 'text-slate-950',
      cardBg: 'bg-stone-50/50 border-slate-350 shadow-md text-slate-950',
      subText: 'text-slate-900',
      title: 'text-slate-950',
      border: 'border-slate-300',
      accentGlow: 'bg-amber-500/5',
      activeTab: 'bg-amber-500/15 text-slate-950 border-2 border-amber-500 font-extrabold shadow-sm'
    };
  };

  const theme = getThemeStyles();
  const currentChapter = CHAPTERS[currentChapterIndex];

  // Render Dynamic Diagram helper for the chapter
  const renderChapterDiagram = (chapId: number) => {
    switch (chapId) {
      case 1: // Foundation Timeline
        return (
          <div className="p-4 rounded-2xl bg-slate-950/45 border border-amber-500/10 mt-6 space-y-3">
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 
              Diagram: Evolution of Ledger Systems
            </span>
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2">
              <div className="w-full md:w-1/4 bg-amber-500/10 p-3 rounded-lg border border-amber-500/15 text-center">
                <span className="text-[9px] font-mono text-amber-500 block uppercase font-bold">10,000 BC</span>
                <span className="text-xs font-black text-white">Barter System</span>
                <p className="text-[10px] text-slate-400 mt-1">Direct item swap</p>
              </div>
              <ChevronRight className="w-5 h-5 text-amber-400/50 rotate-90 md:rotate-0" />
              <div className="w-full md:w-1/4 bg-blue-500/10 p-3 rounded-lg border border-blue-500/15 text-center">
                <span className="text-[9px] font-mono text-blue-400 block uppercase font-bold">11th Century</span>
                <span className="text-xs font-black text-white">Fiat Paper Ledger</span>
                <p className="text-[10px] text-slate-400 mt-1">Central banks keep record</p>
              </div>
              <ChevronRight className="w-5 h-5 text-amber-400/50 rotate-90 md:rotate-0" />
              <div className="w-full md:w-1/4 bg-teal-500/10 p-3 rounded-lg border border-teal-500/15 text-center">
                <span className="text-[9px] font-mono text-teal-400 block uppercase font-bold">2009 - Present</span>
                <span className="text-xs font-black text-white">Cryptographic Node</span>
                <p className="text-[10px] text-slate-400 mt-1">Sovereign peer-to-peer</p>
              </div>
            </div>
          </div>
        );
      case 2: // Blockchain Block layout visualizer
        return (
          <div className="p-4 rounded-2xl bg-slate-950/45 border border-blue-500/10 mt-6 space-y-3">
            <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Diagram: Verification of Interlocked Blocks
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="bg-blue-950/40 p-3 rounded-xl border border-blue-900/30 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-[#bd9471] font-mono block">BLOCK #001</span>
                  <span className="text-xs font-black text-white block mt-0.5">Genesis Record</span>
                </div>
                <div className="mt-3 text-[9px] font-mono text-slate-400 border-t border-blue-900/20 pt-1.5">
                  <span className="block text-blue-400">HASH: 0000a89d...</span>
                  <span className="block text-slate-500">PREV: 00000000...</span>
                </div>
              </div>
              <div className="bg-blue-950/40 p-3 rounded-xl border border-blue-900/30 flex flex-col justify-between relative">
                <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 text-blue-500 hidden md:block">→</div>
                <div>
                  <span className="text-[9px] text-[#bd9471] font-mono block">BLOCK #002</span>
                  <span className="text-xs font-black text-white block mt-0.5">DeFi Swaps Set</span>
                </div>
                <div className="mt-3 text-[9px] font-mono text-slate-400 border-t border-blue-900/20 pt-1.5">
                  <span className="block text-blue-400">HASH: 0000f57c...</span>
                  <span className="block text-teal-400">PREV: 0000a89d</span>
                </div>
              </div>
              <div className="bg-[#050e26] p-3 rounded-xl border border-amber-500/20 flex flex-col justify-between relative animate-pulse">
                <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 text-blue-500 hidden md:block">→</div>
                <div>
                  <span className="text-[9px] text-amber-400 font-mono block font-bold">BLOCK #003 (Mined)</span>
                  <span className="text-xs font-black text-white block mt-0.5">Verse Staking lock</span>
                </div>
                <div className="mt-3 text-[9px] font-mono text-slate-400 border-t border-blue-900/20 pt-1.5">
                  <span className="block text-amber-400">HASH: Pending Math</span>
                  <span className="block text-teal-400">PREV: 0000f57c</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 3: // Verse DEX Cycle
        return (
          <div className="p-4 rounded-2xl bg-slate-950/45 border border-teal-500/10 mt-6 space-y-3">
            <span className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-widest flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-teal-400" />
              Diagram: Decentralized Automated Liquidity Swap
            </span>
            <div className="flex flex-col sm:flex-row justify-around items-center gap-4 bg-[#03091c] p-4 rounded-xl border border-blue-900/20">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-teal-500/15 flex items-center justify-center text-teal-400 border border-teal-500/30 mx-auto">
                  USER
                </div>
                <p className="text-[10px] font-mono text-slate-400 mt-1">Liquidity Provider</p>
              </div>
              <div className="text-center font-black text-amber-500 text-lg">⇄</div>
              <div className="text-center bg-blue-950/40 p-2.5 rounded-lg border border-blue-900/40">
                <span className="text-xs font-black text-white block">Smart Pool Vault</span>
                <span className="font-mono text-[9px] text-teal-400">VERSE - ETH - USDC</span>
              </div>
              <div className="text-center font-black text-amber-500 text-lg">⇄</div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-400 border border-amber-500/30 mx-auto">
                  SWAPPER
                </div>
                <p className="text-[10px] font-mono text-slate-400 mt-1">Instant Trade Swaps</p>
              </div>
            </div>
          </div>
        );
      case 5: // Web1 -> Web2 -> Web3 comparison
        return (
          <div className="p-4 rounded-2xl bg-slate-950/45 border border-purple-500/10 mt-6 space-y-3">
            <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              Diagram: Interactive internet evolution comparison matrix
            </span>
            <div className="grid grid-cols-3 gap-2.5 pt-2 text-center text-[10px]">
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="font-bold text-slate-400 uppercase block font-mono text-[8.5px]">WEB 1.0</span>
                <span className="font-black text-slate-100 block my-1">READ ONLY</span>
                <p className="text-slate-500 text-[9px] leading-tight">Static documents. No registration, only view.</p>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-blue-900/20">
                <span className="font-bold text-blue-500 uppercase block font-mono text-[8.5px]">WEB 2.0</span>
                <span className="font-black text-blue-400 block my-1">READ & WRITE</span>
                <p className="text-slate-500 text-[9px] leading-tight">Social corporate sites. Central silos own database and profiles.</p>
              </div>
              <div className="bg-[#0e0a1f] p-2.5 rounded-xl border border-purple-500/25">
                <span className="font-bold text-purple-400 uppercase block font-mono text-[8.5px]">WEB 3.0</span>
                <span className="font-black text-purple-300 block my-1">READ-WRITE-OWN</span>
                <p className="text-slate-400 text-[9px] leading-tight">Crypto tokens + wallets. Complete physical ownership of accounts.</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 md:p-8 rounded-[2rem] border overflow-visible relative shadow-2xl ${theme.bg} ${theme.text} ${theme.border}`}>
      {/* Background radial glows for aesthetic immersion */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* TOP FLOATING NOTIFICATION BANNER */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.95 }}
            className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[10000] bg-slate-950/95 border-2 border-amber-500/40 px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 w-[90%] max-w-md"
          >
            <Trophy className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
            <span className="text-xs sm:text-sm text-slate-100 font-extrabold font-sans leading-snug">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COMPONENT HEADER CORE NAVIGATION PANEL */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-blue-900/20 pb-6 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-900 border border-blue-900/30 text-amber-500 font-black text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-amber-500" />
          Back to Portal
        </button>
        
        <div className="text-center sm:text-right">
          <h2 className="text-xl sm:text-2xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-teal-400 tracking-wider">
            Verse Ecosystem Book
          </h2>
          <p className="text-[10px] font-mono tracking-widest text-[#bd9471] font-bold uppercase mt-1">
            Complete Digital Knowledge Platform & Academy 📖
          </p>
        </div>
      </div>

      {/* ECOSYSTEM THEMES & TABS CONTROLLERS */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 relative z-20">
        
        {/* TABS SELECTOR */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-300 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('book')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 flex-1 sm:flex-initial justify-center ${activeTab === 'book' ? theme.activeTab : 'text-slate-700 hover:text-[#7c2d12] hover:bg-amber-500/5'}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read Chapters</span>
          </button>
          
          <button
            onClick={() => { setActiveTab('timeline'); setSelectedSubTopic(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 flex-1 sm:flex-initial justify-center ${activeTab === 'timeline' ? theme.activeTab : 'text-slate-700 hover:text-[#7c2d12] hover:bg-amber-500/5'}`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </button>

          <button
            onClick={() => { setActiveTab('glossary'); setSelectedSubTopic(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 flex-1 sm:flex-initial justify-center ${activeTab === 'glossary' ? theme.activeTab : 'text-slate-700 hover:text-[#7c2d12] hover:bg-amber-500/5'}`}
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>A-Z Glossary</span>
          </button>

          <button
            onClick={() => { setActiveTab('faq'); setSelectedSubTopic(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 flex-1 sm:flex-initial justify-center ${activeTab === 'faq' ? theme.activeTab : 'text-slate-700 hover:text-[#7c2d12] hover:bg-amber-500/5'}`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FAQ</span>
          </button>
        </div>


      </div>

      {/* ACADEMY PROGRESS INDICATOR TRACKER */}
      <div className="bg-stone-50 border border-slate-300 p-5 rounded-3xl shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-700 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-950 uppercase tracking-wider">Interactive Academy Progress: {readingProgressPercentage}% Complete</h4>
              <p className="text-xs text-slate-600 font-bold">Read topics to level up your crypto IQ and claim verified bonus tokens.</p>
            </div>
          </div>
          <div className="w-full sm:w-44 flex flex-col gap-1.5 shrink-0">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-300">
              <motion.div 
                className="h-full bg-gradient-to-r from-green-600 to-teal-500" 
                layout
                initial={{ width: 0 }}
                animate={{ width: `${readingProgressPercentage}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-600 font-bold uppercase">
              <span>{completedTopics.length} of {totalTopicsCount} Read</span>
              <span>{Math.round(readingProgressPercentage)}% Done</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== ACTIVE VIEWPORT ROUTER DISPLAY ==================== */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: INTEGRATED BOOK COMPONENT */}
        {activeTab === 'book' && (
          <motion.div
            key="book-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10"
          >
            {/* LEFT BAR: INDEX DIRECTORY PANEL */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Search index and query filter block */}
              <div className="bg-white p-4 rounded-2xl border border-slate-300 space-y-1 shadow-sm">
                <span className="text-[9px] font-mono font-extrabold uppercase text-slate-600 tracking-wider">Search Book Contents:</span>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search terms, chapters, formulas..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-9 pr-4 text-xs font-bold text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all font-sans"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 hover:text-slate-950 text-slate-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Book Chapter Index list */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                <span className="text-[10px] font-mono font-black uppercase text-slate-700 tracking-widest block px-1">
                  Table of Contents
                </span>

                <div className="space-y-2">
                  {filteredChapters.map((chap, idx) => {
                    const isSelected = chap.id === currentChapter.id;
                    const ChapIcon = chap.icon;
                    
                    // Count completed topics in this chapter
                    const completedInChap = chap.topics.filter(t => completedTopics.includes(t.id)).length;
                    const totalInChap = chap.topics.length;
                    const chapPercent = Math.round((completedInChap / totalInChap) * 100);

                    return (
                      <button
                        key={chap.id}
                        onClick={() => {
                          setCurrentChapterIndex(CHAPTERS.findIndex(c => c.id === chap.id));
                          setSelectedSubTopic(null);
                          resetQuiz();
                        }}
                        className={`w-full text-left p-4 rounded-2.5xl border transition-all cursor-pointer relative group overflow-hidden ${
                          isSelected
                            ? 'bg-amber-50 border-amber-500 shadow-md'
                            : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-350'
                        }`}
                      >
                        {/* Glow slide-in on active */}
                        {isSelected && (
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500" />
                        )}

                        <div className="flex items-center gap-3.5">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105 duration-300 ${isSelected ? 'border-amber-500/40 text-amber-600 bg-amber-500/5' : 'border-slate-200 text-slate-500 bg-slate-50'}`}>
                            <ChapIcon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[8.5px] font-mono font-black tracking-widest text-amber-700 block uppercase">
                              CHAPTER 0{chap.id}
                            </span>
                            <h3 className="text-xs sm:text-sm font-black text-slate-950 tracking-tight truncate mt-0.5 group-hover:text-amber-700 transition-colors">
                              {chap.title}
                            </h3>
                            <p className="text-[10.5px] text-slate-700 font-bold truncate italic mt-0.5">
                              {chap.bengaliTitle}
                            </p>
                          </div>
                        </div>

                        {/* Progression bar in search item */}
                        <div className="mt-3.5 flex items-center justify-between gap-4 text-[9px] font-mono text-slate-500 border-t border-slate-200 pt-2 font-bold">
                          <span className={`${chapPercent === 100 ? 'text-green-600' : 'text-slate-600'}`}>
                            {completedInChap}/{totalInChap} topics read
                          </span>
                          <span className="text-slate-700">{chapPercent}%</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT BAR: CURRENT SELECTED CHAPTER READER */}
            <div className="lg:col-span-8">
              
              {/* Dynamic twin-pane editorial wrapper */}
              <div className={`rounded-3xl p-5 sm:p-7 border ${theme.cardBg} space-y-6 relative overflow-visible`}>
                
                {/* Visual Cover Sheet for current selection */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-500 text-amber-700 font-extrabold text-xs">
                      CH0{currentChapter.id}
                    </div>
                    <div>
                      <span className="text-[9px] font-mono bg-amber-500/10 border border-amber-500/20 text-amber-800 px-2 py-0.5 rounded font-black uppercase">
                        Current Study Hub
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight mt-1">
                        {currentChapter.title}
                      </h3>
                      <p className="text-xs text-amber-805 font-mono uppercase font-black tracking-wider mt-0.5">
                        {currentChapter.bengaliTitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={markCurrentChapterRead}
                      className="px-3.5 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-mono font-bold uppercase hover:bg-green-500/15 transition-all text-center"
                    >
                      ✓ Mark all read
                    </button>
                  </div>
                </div>

                {/* Subtitle bilingual Summary block */}
                <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-250 space-y-1.5">
                  <p className="text-xs sm:text-sm text-slate-900 font-bold leading-relaxed">
                    {currentChapter.summary}
                  </p>
                </div>

                {/* ITERATING TOPICS DEFINITIONS */}
                <div className="space-y-6">
                  {currentChapter.topics.map((topic, tIdx) => {
                    const isCompleted = completedTopics.includes(topic.id);
                    const isBookmarked = bookmarks.includes(topic.id);

                    return (
                      <div 
                        key={topic.id}
                        className="bg-stone-50/40 p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-slate-350 transition-all space-y-4"
                      >
                        {/* Section Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded bg-amber-500/10 text-amber-800 font-mono text-xs font-black flex items-center justify-center border border-amber-500/20">
                              {topic.id}
                            </span>
                            <div className="min-w-0">
                              <h4 className="text-xs sm:text-sm font-black text-slate-950 tracking-tight">
                                {topic.title}
                              </h4>
                              <p className="text-[10.5px] text-amber-800 font-mono font-bold truncate">
                                {topic.bengaliTitle}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Bookmark Button */}
                            <button
                              onClick={() => toggleBookmark(topic.id)}
                              className={`p-2 rounded-xl border cursor-pointer transition-colors ${
                                isBookmarked
                                  ? 'bg-amber-500/15 border-amber-500 text-amber-800 font-black'
                                  : 'bg-white border-slate-250 text-slate-600 hover:text-slate-900 hover:border-slate-350'
                              }`}
                              title="Bookmark or save section"
                            >
                              <Bookmark className="w-3.5 h-3.5" />
                            </button>

                            {/* Mark as read complete checkbox button */}
                            <button
                              onClick={() => handleToggleTopicComplete(topic.id)}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-[9px] font-mono font-extrabold uppercase transition-all cursor-pointer ${
                                isCompleted
                                  ? 'bg-green-500/10 border-green-500/50 text-green-700'
                                  : 'bg-white border-slate-250 text-slate-600 hover:text-slate-900 hover:border-slate-350'
                              }`}
                            >
                              {isCompleted ? <Check className="w-3 h-3 text-green-600" /> : null}
                              <span>{isCompleted ? 'Completed' : 'Mark complete'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Description bilingual text */}
                        <div className="space-y-3 text-slate-950">
                          <p className="text-xs sm:text-sm leading-relaxed font-bold">
                            {topic.description}
                          </p>
                          <p className="text-xs text-amber-900/95 leading-relaxed bg-amber-500/[0.01] border-l-2 border-amber-700/30 pl-3 italic font-bold">
                            {topic.bengaliDescription}
                          </p>
                        </div>

                        {/* Core educational bullet cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                          <div className="bg-amber-500/[0.03] p-3.5 rounded-xl border border-amber-500/10 space-y-2">
                            <span className="text-[9px] uppercase font-mono font-black text-amber-800 tracking-wider">Key Takeaways</span>
                            <ul className="text-[11px] space-y-1.5 text-slate-950">
                              {topic.bullets.map((b, bIdx) => (
                                <li key={bIdx} className="flex gap-2 items-start leading-relaxed font-bold">
                                  <span className="text-amber-600 font-extrabold">▪</span> {b}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Render Dynamic Infographics diagrams based on ChapterId */}
                {renderChapterDiagram(currentChapter.id)}

                {/* INTERACTIVE APPLIED KNOWLEDGE TEST UNIT: CHAPTER QUIZ */}
                <div className="pt-6 border-t border-slate-200 space-y-4">
                  <div className="bg-purple-500/[0.03] border border-purple-200 rounded-2.5xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-purple-100 pb-3">
                      <span className="text-[10px] font-mono uppercase bg-purple-100 text-purple-900 px-3 py-1 rounded border border-purple-200 font-black tracking-widest flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5" />
                        Interactive Chap 0{currentChapter.id} Quiz
                      </span>
                      {quizScoreCard[currentChapter.id] ? (
                        <span className="text-[10px] font-mono text-green-500 font-black uppercase bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 rounded">
                          ✓ Passed (+50 pts earned)
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[#bd9471] font-black uppercase tracking-wider">
                          Earn 50 Game Points!
                        </span>
                      )}
                    </div>

                    <div className="space-y-4 text-slate-950">
                      <div className="space-y-2">
                        <h4 className="text-sm sm:text-base font-black leading-snug">
                          {currentChapter.quiz.question}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5">
                        {currentChapter.quiz.options.map((opt, oIdx) => {
                          const isSelected = selectedOptionIndex === oIdx;
                          const isCorrect = oIdx === currentChapter.quiz.answerIndex;
                          
                          let btnStyle = "bg-white border-slate-300 hover:border-purple-400 hover:bg-purple-50/20 text-slate-900";
                          if (quizAnswered) {
                            if (isCorrect) btnStyle = "bg-green-500/10 border-green-500 text-green-700 font-bold";
                            else if (isSelected) btnStyle = "bg-rose-500/10 border-rose-500 text-rose-700 font-bold";
                            else btnStyle = "bg-stone-100/50 border-stone-200 text-slate-500";
                          }

                          return (
                            <button
                              key={oIdx}
                              disabled={quizAnswered}
                              onClick={() => submitQuizAnswer(oIdx)}
                              className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all cursor-pointer ${btnStyle} flex flex-col justify-start`}
                            >
                              <span className="font-bold block">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Display response explanations if answered */}
                      {quizAnswered && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl border border-purple-200 bg-purple-100/40 space-y-2 text-xs leading-relaxed"
                        >
                          <p className="font-extrabold text-purple-900 uppercase font-mono text-[10px]">Verification & Explanation:</p>
                          <p className="text-slate-900 font-bold">{currentChapter.quiz.explanation}</p>
                          
                          <button
                            onClick={resetQuiz}
                            className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono text-purple-900 hover:text-purple-700 font-extrabold uppercase bg-purple-100 py-1.5 px-3 rounded border border-purple-300 mt-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Reset / Re-solve Question
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>

                {/* BOTTOM COMPONENT SWIPER CONTROLLER */}
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200">
                  <button
                    disabled={currentChapterIndex === 0}
                    onClick={() => {
                      setCurrentChapterIndex(prev => prev - 1);
                      setSelectedSubTopic(null);
                      resetQuiz();
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl bg-slate-50 border border-slate-300 text-slate-800 hover:bg-slate-100 hover:text-black disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous Chapter
                  </button>

                  <span className="text-xs font-mono font-black text-slate-600">
                    Chapter {currentChapter.id} of {CHAPTERS.length}
                  </span>

                  <button
                    disabled={currentChapterIndex === CHAPTERS.length - 1}
                    onClick={() => {
                      setCurrentChapterIndex(prev => prev + 1);
                      setSelectedSubTopic(null);
                      resetQuiz();
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl bg-slate-50 border border-slate-300 text-slate-800 hover:bg-slate-100 hover:text-black disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    Next Chapter
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 2: CHRONOLOGICAL EDUCATION TIMELINE */}
        {activeTab === 'timeline' && (
          <motion.div
            key="timeline-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className={`rounded-3xl p-5 sm:p-7 border ${theme.cardBg} space-y-6 relative overflow-visible max-w-3xl mx-auto`}
          >
            <div className="text-center pb-3">
              <span className="text-[10px] font-mono bg-[#bd9471]/10 text-amber-900 border border-amber-500/20 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                Interactive Chronological Timeline
              </span>
              <h3 className="text-xl font-black text-slate-950 tracking-tight mt-2">Historic Milestone of Decentralization</h3>
            </div>

            <div className="relative border-l border-slate-200 ml-4 pl-6 space-y-8 py-4">
              
              {/* Timeline item 1 */}
              <div className="relative">
                <span className="absolute -left-10 top-0.5 w-8 h-8 rounded-full bg-white border-2 border-amber-500 flex items-center justify-center font-mono text-[9px] font-black text-amber-700">2008</span>
                <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200 space-y-1">
                  <h4 className="text-xs sm:text-sm font-black text-slate-950">The Bitcoin Whitepaper Published</h4>
                  <p className="text-xs text-slate-800 leading-relaxed font-bold">
                    Satoshi Nakamoto published 'Bitcoin: A Peer-to-Peer Electronic Cash System', solving the double-spend problem without servers.
                  </p>
                </div>
              </div>

              {/* Timeline item 2 */}
              <div className="relative">
                <span className="absolute -left-10 top-0.5 w-8 h-8 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center font-mono text-[9px] font-black text-blue-700">2010</span>
                <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200 space-y-1">
                  <h4 className="text-xs sm:text-sm font-black text-slate-950">The Historic Genesis Bitcoin Pizza Day</h4>
                  <p className="text-xs text-slate-800 leading-relaxed font-bold">
                    Laszlo Hanyecz paid 10,000 BTC to buy two large pizzas, marking the first real-world commercial transaction.
                  </p>
                </div>
              </div>

              {/* Timeline item 3 */}
              <div className="relative">
                <span className="absolute -left-10 top-0.5 w-8 h-8 rounded-full bg-white border-2 border-purple-500 flex items-center justify-center font-mono text-[9px] font-black text-purple-700">2015</span>
                <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200 space-y-1">
                  <h4 className="text-xs sm:text-sm font-black text-slate-950">The Launch of Ethereum & Smart Contracts</h4>
                  <p className="text-xs text-slate-800 leading-relaxed font-bold">
                    Vitalik Buterin designed Ethereum, transforming blockchain from a simple ledger of values into a globally programmable computer.
                  </p>
                </div>
              </div>

              {/* Timeline item 4 */}
              <div className="relative">
                <span className="absolute -left-10 top-0.5 w-8 h-8 rounded-full bg-white border-2 border-teal-500 flex items-center justify-center font-mono text-[9px] font-black text-teal-700">2022</span>
                <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200 space-y-1">
                  <h4 className="text-xs sm:text-sm font-black text-slate-950">Verse Launch and Bitcoin.com Integration</h4>
                  <p className="text-xs text-slate-800 leading-relaxed font-bold">
                    VERSE officially launched as the primary coordinate of Bitcoin.com's ecosystem, introducing clean community incentivized frameworks.
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 3: A-Z GLOSSARY TERMINOLOGY ARCHIVE */}
        {activeTab === 'glossary' && (
          <motion.div
            key="glossary-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className={`rounded-3xl p-5 sm:p-7 border ${theme.cardBg} space-y-6 relative overflow-visible`}
          >
            {/* Title & Glossary Search bar */}
            <div className="text-center pb-2 max-w-md mx-auto space-y-3">
              <span className="text-[10px] font-mono bg-blue-100 text-blue-900 border border-blue-200 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                Crypto Dictionary & Glossary
              </span>
              <h3 className="text-xl font-black text-slate-950 tracking-tight mt-1">Foundational Terminology definitions</h3>
              
              <div className="relative mt-2">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  placeholder="Filter key terms alphabetically..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-9 pr-4 text-xs font-bold text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all font-sans"
                />
              </div>
            </div>

            {/* Glossary list layout cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GLOSSARY_TERMS.filter(item => 
                item.term.toLowerCase().includes(glossarySearch.toLowerCase()) || 
                item.def.toLowerCase().includes(glossarySearch.toLowerCase())
              ).map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-50 p-4.5 rounded-2.5xl border border-slate-200 hover:border-slate-300 transition-all space-y-2"
                >
                  <h4 className="text-xs sm:text-sm font-black text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-600" />
                    {item.term}
                  </h4>
                  <div className="space-y-1.5">
                    <p className="text-xs text-slate-900 leading-relaxed font-bold">
                      {item.def}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 4: FREQUENTLY ASKED QUESTIONS */}
        {activeTab === 'faq' && (
          <motion.div
            key="faq-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className={`rounded-3xl p-5 sm:p-7 border ${theme.cardBg} space-y-6 relative overflow-visible max-w-3xl mx-auto`}
          >
            <div className="text-center pb-2">
              <span className="text-[10px] font-mono bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                Ecosystem FAQ Portal
              </span>
              <h3 className="text-xl font-black text-slate-950 tracking-tight mt-2">Any outstanding questions answered</h3>
            </div>

            <div className="space-y-4">
              {FAQ_LIST.map((faq, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-50 p-5 rounded-2.5xl border border-slate-200 space-y-2.5"
                >
                  <h4 className="text-xs sm:text-sm font-black text-slate-950 flex items-start gap-2.5 leading-snug">
                    <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </h4>
                  <div className="pl-6.5 text-xs text-slate-900 leading-relaxed space-y-2 border-l border-slate-200 pl-4">
                    <p className="font-bold text-slate-800">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* BOTTOM CONTROL BRAND LABELS & UTILITIES */}
      <div className="flex flex-col items-center gap-3.5 pt-8 pb-4 mt-8 border-t border-amber-500/10 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-500/5 px-4 py-2 rounded-full border border-amber-500/10">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-[#8b5e3c] font-mono tracking-wider font-extrabold uppercase">
            Sovereign Ledger Certified • Verse Academy Hub
          </span>
        </div>
      </div>
    </div>
  );
}
