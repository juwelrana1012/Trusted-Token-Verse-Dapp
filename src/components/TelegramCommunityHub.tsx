import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Search, 
  Info,
  Layers,
  BookOpen,
  Award,
  Users,
  Bell,
  HelpCircle,
  FileText,
  Gamepad2,
  Mic,
  Rocket,
  Link,
  Copy,
  ExternalLink,
  Globe,
  Maximize2,
  Check,
  X
} from 'lucide-react';

interface CommunityTopic {
  id: number;
  name: string;
  iconType: 'symbol' | 'image' | 'text-bubble' | 'custom';
  iconValue: string;
  iconBgColor: string;
  iconTextColor: string;
  overview: string;
  findHere: string[];
  whyMatters: string;
}

const COMMUNITY_TOPICS: CommunityTopic[] = [
  {
    id: 1,
    name: "General",
    iconType: 'symbol',
    iconValue: "#",
    iconBgColor: "bg-slate-450",
    iconTextColor: "text-slate-700",
    overview: "The General section is the primary communication channel of the community and serves as the central source of information for all members.",
    findHere: [
      "Community-wide announcements",
      "Important updates and notices",
      "General discussions",
      "Member questions and answers",
      "Community guidelines and information"
    ],
    whyMatters: "This is one of the most important sections in the community, as major announcements and official information are typically shared here first."
  },
  {
    id: 2,
    name: "Verse",
    iconType: 'image',
    iconValue: "https://i.ibb.co.com/6R2VXfBG/file-000000005e3472089aedcd9ec7a50852.png",
    iconBgColor: "bg-gradient-to-tr from-purple-500 to-pink-500",
    iconTextColor: "text-white",
    overview: "The Verse topic is dedicated to discussions surrounding the Verse ecosystem, its products, community initiatives, and future developments.",
    findHere: [
      "Verse Token updates",
      "Ecosystem developments",
      "Community campaigns",
      "Product launches",
      "Governance discussions"
    ],
    whyMatters: "Verse is at the heart of the Bitcoin.com ecosystem, making this section a key destination for community members interested in ecosystem growth and opportunities."
  },
  {
    id: 3,
    name: "Bitcoin.com News",
    iconType: 'symbol',
    iconValue: "📰",
    iconBgColor: "bg-amber-500/10",
    iconTextColor: "text-amber-500",
    overview: "Stay informed with the latest developments from Bitcoin.com and the broader cryptocurrency industry.",
    findHere: [
      "Breaking crypto news",
      "Bitcoin market updates",
      "Blockchain industry developments",
      "Official Bitcoin.com publications",
      "Global Web3 trends"
    ],
    whyMatters: "This section helps members remain informed about important events and developments affecting the crypto ecosystem."
  },
  {
    id: 4,
    name: "Verse Women",
    iconType: 'text-bubble',
    iconValue: "V",
    iconBgColor: "bg-red-500",
    iconTextColor: "text-white",
    overview: "Verse Women is a dedicated space designed to support and empower women participating in Web3 and blockchain technology.",
    findHere: [
      "Women's leadership initiatives",
      "Educational resources",
      "Mentorship opportunities",
      "Networking and collaboration",
      "Community engagement activities"
    ],
    whyMatters: "This space encourages greater participation and representation of women within the Web3 ecosystem."
  },
  {
    id: 5,
    name: "Verse Research",
    iconType: 'text-bubble',
    iconValue: "V",
    iconBgColor: "bg-red-650",
    iconTextColor: "text-white",
    overview: "A research-focused section where members analyze blockchain projects, market trends, and emerging technologies.",
    findHere: [
      "Market analysis",
      "Token research",
      "Project evaluations",
      "Industry reports",
      "Trend forecasting"
    ],
    whyMatters: "Research and data-driven insights help community members make informed decisions and stay ahead of industry developments."
  },
  {
    id: 6,
    name: "Learn Skills with Verse",
    iconType: 'text-bubble',
    iconValue: "L",
    iconBgColor: "bg-purple-600",
    iconTextColor: "text-white",
    overview: "An educational hub focused on helping members develop practical Web3 and professional skills.",
    findHere: [
      "Web3 learning resources",
      "Community management training",
      "Content creation guides",
      "Social media skills",
      "Professional development opportunities"
    ],
    whyMatters: "This section supports personal growth and helps members acquire valuable skills that can be applied within and beyond the blockchain industry."
  },
  {
    id: 7,
    name: "Vibe Coding with Verse",
    iconType: 'text-bubble',
    iconValue: "V",
    iconBgColor: "bg-blue-505",
    iconTextColor: "text-white",
    overview: "A dedicated space for developers, coders, and aspiring blockchain engineers.",
    findHere: [
      "Programming discussions",
      "Smart contract development",
      "Blockchain coding tutorials",
      "Web development resources",
      "Technical collaboration"
    ],
    whyMatters: "Technology is the foundation of Web3, and this section provides valuable learning and collaboration opportunities for builders and developers."
  },
  {
    id: 8,
    name: "Verse Urdu",
    iconType: 'text-bubble',
    iconValue: "V",
    iconBgColor: "bg-red-500",
    iconTextColor: "text-white",
    overview: "A regional community designed specifically for Urdu-speaking members.",
    findHere: [
      "Discussions in Urdu",
      "Local educational content",
      "Regional support",
      "Community engagement"
    ],
    whyMatters: "Language accessibility helps create a more inclusive and welcoming environment for members from diverse backgrounds."
  },
  {
    id: 9,
    name: "Verse Events",
    iconType: 'text-bubble',
    iconValue: "V",
    iconBgColor: "bg-pink-500",
    iconTextColor: "text-white",
    overview: "The official destination for community events and gatherings.",
    findHere: [
      "Online workshops",
      "Community meetups",
      "Conferences",
      "Educational sessions",
      "Networking opportunities"
    ],
    whyMatters: "Events help strengthen community relationships and provide opportunities for learning and collaboration."
  },
  {
    id: 10,
    name: "Verse Recruitment (Socials)",
    iconType: 'text-bubble',
    iconValue: "V",
    iconBgColor: "bg-red-400",
    iconTextColor: "text-white",
    overview: "A space dedicated to recruiting and onboarding new contributors for social and community-related activities.",
    findHere: [
      "Recruitment opportunities",
      "Team-building initiatives",
      "Contributor applications",
      "Community roles"
    ],
    whyMatters: "This section helps expand the community by connecting talented individuals with meaningful opportunities."
  },
  {
    id: 11,
    name: "Verse Builders Hub",
    iconType: 'text-bubble',
    iconValue: "V",
    iconBgColor: "bg-emerald-500",
    iconTextColor: "text-white",
    overview: "The Builders Hub is a collaborative environment for innovators, creators, and project developers.",
    findHere: [
      "Project development discussions",
      "Builder networking",
      "Collaboration opportunities",
      "Startup ideas",
      "Technical innovation"
    ],
    whyMatters: "Builders are essential to ecosystem growth, and this section encourages innovation and project creation."
  },
  {
    id: 12,
    name: "Verse Nigeria",
    iconType: 'text-bubble',
    iconValue: "V",
    iconBgColor: "bg-[#f97316]", // Orange
    iconTextColor: "text-white",
    overview: "A dedicated community for members from Nigeria.",
    findHere: [
      "Local discussions",
      "Regional updates",
      "Community activities",
      "Educational support"
    ],
    whyMatters: "Regional communities help members connect and collaborate within their local ecosystem."
  },
  {
    id: 13,
    name: "Memes",
    iconType: 'symbol',
    iconValue: "🤪",
    iconBgColor: "bg-amber-300/20",
    iconTextColor: "text-yellow-600",
    overview: "A fun and engaging section dedicated to humor and community entertainment.",
    findHere: [
      "Crypto memes",
      "Community jokes",
      "Viral content",
      "Creative contributions"
    ],
    whyMatters: "A healthy community thrives on engagement, creativity, and enjoyment."
  },
  {
    id: 14,
    name: "Newbies (Start Here)",
    iconType: 'text-bubble',
    iconValue: "N",
    iconBgColor: "bg-green-550",
    iconTextColor: "text-white",
    overview: "The starting point for all new community members.",
    findHere: [
      "Community introductions",
      "Beginner guides",
      "Rules and guidelines",
      "Helpful resources",
      "Frequently asked questions"
    ],
    whyMatters: "This section helps newcomers navigate the ecosystem with confidence."
  },
  {
    id: 15,
    name: "Verse HQ",
    iconType: 'text-bubble',
    iconValue: "V",
    iconBgColor: "bg-orange-500",
    iconTextColor: "text-white",
    overview: "The headquarters of community discussions and strategic initiatives.",
    findHere: [
      "Leadership communications",
      "Major ecosystem discussions",
      "Community planning",
      "Strategic updates"
    ],
    whyMatters: "Verse HQ serves as one of the central hubs for high-level community engagement."
  },
  {
    id: 16,
    name: "Accelerator",
    iconType: 'symbol',
    iconValue: "🚀",
    iconBgColor: "bg-amber-500/10",
    iconTextColor: "text-amber-500",
    overview: "Focused on innovation, startup development, and project acceleration.",
    findHere: [
      "Startup support",
      "Project mentorship",
      "Growth strategies",
      "Innovation programs"
    ],
    whyMatters: "This section helps promising ideas and projects move from concept to execution."
  },
  {
    id: 17,
    name: "Verse Bangladesh",
    iconType: 'text-bubble',
    iconValue: "V",
    iconBgColor: "bg-[#006a4e]", // Bangladesh Green
    iconTextColor: "text-white",
    overview: "A dedicated space for the Bangladeshi Verse community with custom linguistic accessibility.",
    findHere: [
      "Bengali-language discussions",
      "Local events",
      "Educational initiatives",
      "Community collaboration"
    ],
    whyMatters: "Supports the growth of the Web3 ecosystem within Bangladesh."
  },
  {
    id: 18,
    name: "Verse Egypt",
    iconType: 'text-bubble',
    iconValue: "V",
    iconBgColor: "bg-purple-700",
    iconTextColor: "text-white",
    overview: "A community space for members from Egypt.",
    findHere: [
      "Regional discussions",
      "Community networking",
      "Educational content",
      "Local engagement"
    ],
    whyMatters: "Encourages participation and collaboration among Egyptian community members."
  },
  {
    id: 19,
    name: "App Rewards Discussion",
    iconType: 'text-bubble',
    iconValue: "A",
    iconBgColor: "bg-purple-500",
    iconTextColor: "text-white",
    overview: "Dedicated to discussions about rewards, incentives, and app-related earning opportunities.",
    findHere: [
      "Reward programs",
      "Points systems",
      "Incentives",
      "User support"
    ],
    whyMatters: "Helps members maximize their participation and understand available reward mechanisms."
  },
  {
    id: 20,
    name: "Verse Correspondents",
    iconType: 'symbol',
    iconValue: "📝",
    iconBgColor: "bg-blue-500/10",
    iconTextColor: "text-blue-500",
    overview: "A content-focused section for community reporters, writers, and storytellers.",
    findHere: [
      "Community reporting",
      "Article creation",
      "Event coverage",
      "News contributions"
    ],
    whyMatters: "This section helps document and share the achievements and activities of the community."
  },
  {
    id: 21,
    name: "Games",
    iconType: 'symbol',
    iconValue: "🎮",
    iconBgColor: "bg-green-500/10",
    iconTextColor: "text-green-500",
    overview: "A space for gaming enthusiasts interested in blockchain and Web3 gaming.",
    findHere: [
      "Web3 games",
      "Competitions",
      "Gaming discussions",
      "Community events"
    ],
    whyMatters: "Gaming is a growing sector within Web3, and this section supports gamers and developers alike."
  },
  {
    id: 22,
    name: "Verse Ghana",
    iconType: 'text-bubble',
    iconValue: "V",
    iconBgColor: "bg-purple-800",
    iconTextColor: "text-white",
    overview: "A dedicated community for members based in Ghana.",
    findHere: [
      "Regional networking in Ghana",
      "Local Web3 educational initiatives",
      "Ghana community discussion threads"
    ],
    whyMatters: "Promotes local networking, education, and community development."
  },
  {
    id: 23,
    name: "Verse India",
    iconType: 'text-bubble',
    iconValue: "V",
    iconBgColor: "bg-purple-600",
    iconTextColor: "text-white",
    overview: "A dedicated space for members from India.",
    findHere: [
      "Regional discussions",
      "Community initiatives",
      "Educational programs",
      "Local networking"
    ],
    whyMatters: "Supports the growth and engagement of the Indian Web3 community."
  },
  {
    id: 24,
    name: "Podcasts",
    iconType: 'symbol',
    iconValue: "🎙️",
    iconBgColor: "bg-pink-500/10",
    iconTextColor: "text-pink-500",
    overview: "A dedicated audio-content hub featuring educational and informative discussions.",
    findHere: [
      "Podcasts and streams",
      "Interviews with crypto experts",
      "Special host segments",
      "Community conversations"
    ],
    whyMatters: "Provides an accessible way for members to learn from industry leaders and community contributors."
  },
  {
    id: 25,
    name: "Support",
    iconType: 'text-bubble',
    iconValue: "S",
    iconBgColor: "bg-sky-500",
    iconTextColor: "text-white",
    overview: "The primary help center for community members.",
    findHere: [
      "Technical support",
      "Account assistance",
      "Community guidance",
      "Troubleshooting help"
    ],
    whyMatters: "Ensures members receive assistance whenever they encounter challenges."
  },
  {
    id: 26,
    name: "Wallet",
    iconType: 'image',
    iconValue: "https://i.ibb.co.com/bRMwqvJz/IMG-20260530-154814.jpg",
    iconBgColor: "bg-amber-500",
    iconTextColor: "text-white",
    overview: "Dedicated to discussions related to the Bitcoin.com Wallet and its features.",
    findHere: [
      "Wallet support",
      "Security guidance",
      "Transaction assistance",
      "Feature updates",
      "User education"
    ],
    whyMatters: "The wallet is one of Bitcoin.com's core products, making this section essential for users seeking support and information."
  }
];

// --- Extensive Topic Detailed Discussions ---
const TOPIC_MORE_DETAILS: Record<number, string> = {
  1: "The General topic is the primary communication channel and the digital town square of the Bitcoin.com Community Hub. It serves as the main source of announcements, guidelines, and direct discussions, helping new members connect immediately with the global community. Here, users can ask general questions about Web3, interact with active participants, explore pinned guidelines, and keep up with major community milestones as they break.",
  2: "The Verse topic is entirely dedicated to the growth and development of the VERSE utility token and its ecosystem products. Within this space, members can explore yield optimization strategies such as locking liquidity in Verse Pools, staking to harvest compound rewards in Verse Farms, and analyzing tokenomics models. It hosts robust discussions regarding buyback schedules, ongoing community campaigns, and governance proposals, making it essential for users who want to grow their Web3 portfolios.",
  3: "Bitcoin.com News provides highly timely market analysis and breaking crypto news to keep the community fully informed. It covers global regulatory trends, on-chain metrics, macro-economic conditions influencing cryptocurrency prices, and core blockchain tech. Members actively debate industry shifts and learn to separate reliable developments from speculative media noise.",
  4: "Verse Women is a flagship empowerment initiative that promotes diversity and inclusion in blockchain. This dedicated space provides web3 webinars, career mentorship, special leadership highlights, and supportive networking channels. It aims to bridge the gender gap in finance and technology, giving creators and developers the resources to build leading Web3 solutions.",
  5: "Verse Research is an intellectual forum for deep technological and fundamental research. Members analyze and evaluate tokenomics models of emerging tokens, smart contract security, cross-chain bridge protocols, and governance setups. Users can share research reports, technical whitepapers, and participate in academic crypto discussions to advance their structural understanding.",
  6: "The Learn Skills with Verse topic is an interactive study hub focused on practical skill development. It features curated training guides for community moderation, graphic design, social media amplification, and technical web development. Members participate in educational challenges where they can earn rewards while learning practical tech skills.",
  7: "Vibe Coding with Verse brings together developers, creators, and builders to collaborate on rapid web application prototyping. It provides smart contract templates, guides on connecting Web3 provider wallets, and live support for building user-centric dApps speed-run. It is a highly collaborative lounge where builders can show their GitHub codes and receive immediate reviews.",
  8: "Verse Urdu offers language-specific support for our Urdu-speaking community members globally. It features high-quality translations of system guides, localized announcements, and localized customer assistance. This ensures that language is never a barrier to learning self-custody and entering decentralized finance.",
  9: "Verse Events manages the master scheduling for virtual live AMAs, technical workshops, Twitter Space panels, and local physical gatherings. Members can register for upcoming sessions, submit questions to core founders, listen to recorded audio files, and participate in community networking days.",
  10: "Verse Recruitment connects community members with direct contributing roles within the ecosystem. Members can apply to become verified moderators, content writers, translation guides, and local brand representatives. Active managers receive continuous training to level up their community leadership skills.",
  11: "Verse Builders Hub serves as an incubator for developers, startup teams, and innovators to pitch their decentralized application ideas. It offers collaborative feedback, guidance on applying for developer grants, and assists founders in finding reliable co-founders or developers to transition projects from concept to deployment.",
  12: "Verse Nigeria is a highly passionate localized community focusing on on-the-ground Web3 adoption. It provides dedicated education about hedging against local inflation, safe peer-to-peer trading practices, mobile self-custodial wallet setups, and coordinates physical workshops in major cities to build strong local relationships.",
  13: "Memes provides a lighthearted space for creative expression and community entertainment. Members post humor related to market indicators, blockchain trends, and trading experiences. Regular meme-making competitions are hosted here where users can earn VERSE tokens for humorous crypto contents.",
  14: "Newbies (Start Here) is the essential security and onboarding terminal for users starting their Web3 journey. It features strict guidelines on writing down and backing up seed phases, recognizing fraudulent apps, avoiding phishing scams, and navigating self-custodial features safely so that users avoid losing funds.",
  15: "Verse HQ serves as the virtual boardroom where core corporate statements, product development updates, strategic brand partnerships, and long-term project roadmaps are shared. Supporters get a transparent view of the behind-the-scenes progress directly from product directors.",
  16: "The Accelerator focuses on connecting early-stage Web3 startup projects with capital partnerships and strategic expansion advisors. Selected builders receive guidance on smart contract auditing, legal setups, liquidity pools structuring, and marketing amplification to launch successfully.",
  17: "Verse Bangladesh provides comprehensive local language guides, Bengali tutorials, and native support channels. It helps Bangladeshi Web3 enthusiasts learn trading best practices, participate in local offline events, and discuss local market updates in an inclusive and supportive environment.",
  18: "Verse Egypt caters to the Egyptian and North African Web3 community, providing high-quality translations of educational assets. It focuses on empowering young people and student developers in Egypt to understand self-custodial finance and build local solutions.",
  19: "App Rewards Discussion explores the maximum utility of the Rewards Center inside the Bitcoin.com Wallet. Users share tips on completing news-reading quizzes, maintaining daily check-in streaks, optimizing cashback payouts, and redeeming earned loyalty points for premium tokens.",
  20: "Verse Correspondents is a creative sanctuary for bloggers, journalists, video creators, and documentation editors. Members collaborate to write weekly ecosystem reviews, design informative infographics, edit tutorials, and publish recurring global community newsletters.",
  21: "Games is the dedicated playground for Web3 and decentralized gaming enthusiasts (GameFi). It hosts conversations about play-to-earn mechanics, NFT integrations, gaming developer tools, and organizes arcade tournaments where members can win prizes while testing new games.",
  22: "Verse Ghana supports Web3 integration in Ghana, hosting educational tours and developer workshops. It guides local business owners on accepting crypto payments and utilizing self-custodial features to facilitate cross-border transactions efficiently.",
  23: "Verse India serves a massive developer and trader hub. It features technical discussions on local regulations, tax tracking, dApp development, and organizes localized developer hackathons to expand community footprint in India.",
  24: "Podcasts is the community audio library featuring recorded episodes of ecosystem shows. Members discuss topics from past episodes, post questions for upcoming speakers, recommend guest stars, and participate in post-episode trivia contests for tokens.",
  25: "Support provides 24/7 technical customer support for wallet and transaction assistance. Managed under verified moderators, members get secure, private help with pending transactions, seed phrase recoveries, and app usage issues.",
  26: "Wallet is the primary development feedback loop for the Bitcoin.com Wallet. Users discuss multi-chain utility roadmap features, test beta updates, share feature suggestions like custom fee sliders, and interact directly with wallet designers."
};

export default function TelegramCommunityHub() {
  const [isGroupExpanded, setIsGroupExpanded] = useState<boolean>(true);
  const [expandedTopicId, setExpandedTopicId] = useState<number | null>(null);
  const [expandedMoreDetailsTopicId, setExpandedMoreDetailsTopicId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isGroupLogoOpen, setIsGroupLogoOpen] = useState<boolean>(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText("https://t.me/GetVerse");
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.warn("Could not copy automatically. Fallback active", err);
    }
  };

  const toggleGroup = () => {
    setIsGroupExpanded(!isGroupExpanded);
  };

  const selectTopic = (id: number) => {
    setExpandedTopicId(expandedTopicId === id ? null : id);
  };

  const filteredTopics = searchQuery.trim() === ''
    ? COMMUNITY_TOPICS
    : COMMUNITY_TOPICS.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.overview.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="w-full max-w-4xl mx-auto my-12" id="bitcoin-community-hub-container">
      {/* Outer Styled Card Frame */}
      <div className="bg-[#0c142c] border border-blue-900/40 rounded-[2.5rem] overflow-hidden shadow-2xl relative transition-all">
        {/* Decorative Telegram blue top line overlay */}
        <div className="h-1.5 bg-gradient-to-r from-sky-500 via-indigo-600 to-sky-400 w-full" />
        
        {/* Core BG radial glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-505/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Telegram Header Interface */}
        <div 
          onClick={toggleGroup}
          className="p-6 md:p-8 bg-sky-950/15 border-b border-blue-900/30 flex items-center justify-between gap-4 cursor-pointer hover:bg-sky-950/25 transition-all select-none"
        >
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Telegram circular icon */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <Send className="w-7 h-7 rotate-45 transform -translate-x-0.5 translate-y-0.5" />
            </div>

            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-300">
                  Bitcoin.com Community Hub
                </span>
                <CheckCircle2 className="w-5.5 h-5.5 text-sky-400 fill-sky-400/20 flex-shrink-0 animate-pulse" />
              </div>
              <p className="text-[11px] font-mono tracking-wider text-slate-400 font-bold uppercase mt-1 flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                26 Official Topics • 18,304 Active Members
              </p>
            </div>
          </div>

          <div className="text-slate-400 bg-sky-950/50 p-2.5 rounded-xl border border-sky-500/10 hover:text-white transition-all transform hover:scale-[1.05]">
            {isGroupExpanded ? <ChevronUp className="w-6 h-6 text-sky-400" /> : <ChevronDown className="w-6 h-6 text-sky-400" />}
          </div>
        </div>

        {/* Collapsible content (Topics section) */}
        <AnimatePresence initial={true}>
          {isGroupExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              {/* Premium Telegram-Style Interactive Group Profile Card */}
              <div className="px-6 md:px-8 pt-6 pb-2">
                <div className="bg-sky-955/10 border border-blue-900/35 rounded-[2rem] p-5 sm:p-7 shadow-xl relative overflow-hidden flex flex-col md:flex-row gap-6 items-start">
                  
                  {/* Subtle Brand Watermark Background */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/5 rounded-full blur-[60px] pointer-events-none" />
                  
                  {/* Avatar Section using high-quality official Bitcoin.com logo instead of the screen capture */}
                  <div className="flex flex-col items-center gap-2.5 flex-shrink-0 mx-auto md:mx-0 relative z-10">
                    <div 
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-emerald-500/35 hover:border-emerald-500/60 shadow-xl overflow-hidden relative group/avatar transition-all duration-300 pointer-events-none"
                    >
                      <img 
                        src="https://i.ibb.co/hx1FvtyV/file-00000000bc08720b9442e03fc47020a2.png" 
                        alt="Bitcoin.com Group Logo" 
                        className="w-full h-full object-cover p-2 bg-slate-900 transition-transform duration-500 group-hover/avatar:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs font-mono text-emerald-400 font-extrabold tracking-widest uppercase flex items-center gap-1 select-none">
                      ⚡ Official Logo
                    </span>
                  </div>

                  {/* Group Details & Interactive Info Sheets Area */}
                  <div className="flex-1 space-y-4 text-center md:text-left w-full relative z-10">
                    {/* Header: Title and online counters */}
                    <div>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                        <h4 className="text-2xl sm:text-3xl font-black text-slate-150 tracking-tight leading-tight uppercase font-sans">
                          Bitcoin.com
                        </h4>
                        <span className="bg-sky-500 text-slate-950 font-sans text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 select-none">
                          <CheckCircle2 className="w-3.5 h-3.5 fill-slate-950" /> Verified Group
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                        Ecosystem Development Community Hub
                      </p>
                      
                      {/* Live Indicators in Telegram Style */}
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        <span className="flex items-center gap-1.5 bg-slate-900/40 px-3 py-1 rounded-xl border border-blue-900/10">
                          👥 18,304 Members
                        </span>
                        <span className="flex items-center gap-1.5 bg-slate-900/40 px-3 py-1 rounded-xl border border-blue-900/10 text-emerald-400">
                          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          247 Online
                        </span>
                      </div>
                    </div>

                    {/* Compact Interactive Info List */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-sky-955/20 border border-blue-900/30 text-left space-y-4">
                      
                      {/* Description Field from screen capture */}
                      <div>
                        <span className="text-[10px] font-mono text-emerald-450 font-black uppercase tracking-widest block mb-1">
                          📋 Group Description / বিবরণী
                        </span>
                        <p className="text-xs sm:text-sm text-slate-205 leading-relaxed font-semibold">
                          Since 2015, Bitcoin.com has been a global leader in introducing newcomers to crypto. We make it easy for anyone to buy, spend, trade, invest, earn, and stay up-to-date on cryptocurrency and the future of finance.
                        </p>
                      </div>

                      <div className="h-px bg-blue-900/20" />

                      {/* Official Hyperlinks Rows */}
                      <div>
                        <span className="text-[10px] font-mono text-emerald-450 font-black uppercase tracking-widest block mb-1.5">
                          🔗 Community Channels & Links (ক্লিক করুন)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {/* Announcement Link */}
                          <a 
                            href="https://t.me/GetVerse" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-slate-900/40 hover:bg-emerald-500/10 border border-blue-900/30 hover:border-emerald-500/35 p-3 rounded-2xl transition-all flex items-center justify-between text-slate-205 group/link cursor-pointer"
                          >
                            <span className="font-bold flex items-center gap-1.5">
                              💬 Invite Link (GetVerse)
                            </span>
                            <span className="text-[11px] font-mono font-bold text-emerald-400 group-hover/link:underline flex items-center gap-1">
                              t.me/GetVerse <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            </span>
                          </a>

                          {/* UK Users Link */}
                          <a 
                            href="https://t.me/bitcoincomUK" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-slate-900/40 hover:bg-sky-500/10 border border-blue-900/30 hover:border-sky-500/35 p-3 rounded-2xl transition-all flex items-center justify-between text-slate-205 group/link cursor-pointer"
                          >
                            <span className="font-bold flex items-center gap-1.5">
                              🇬🇧 UK Users Group
                            </span>
                            <span className="text-[11px] font-mono font-bold text-sky-400 group-hover/link:underline flex items-center gap-1">
                              @bitcoincomUK <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            </span>
                          </a>

                          {/* Website Url */}
                          <a 
                            href="https://verse.bitcoin.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-slate-900/40 hover:bg-amber-500/10 border border-blue-900/30 hover:border-amber-500/35 p-3 rounded-2xl transition-all flex items-center justify-between text-slate-205 group/link cursor-pointer"
                          >
                            <span className="font-bold flex items-center gap-1.5">
                              🌐 Ecosystem Portal
                            </span>
                            <span className="text-[11px] font-mono font-bold text-amber-450 group-hover/link:underline flex items-center gap-1">
                              verse.bitcoin.com <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            </span>
                          </a>

                          {/* Announcement Link */}
                          <a 
                            href="https://t.me/VerseToken" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-slate-900/40 hover:bg-indigo-500/10 border border-blue-900/30 hover:border-indigo-500/35 p-3 rounded-2xl transition-all flex items-center justify-between text-slate-205 group/link cursor-pointer"
                          >
                            <span className="font-bold flex items-center gap-1.5">
                              📢 Announcements
                            </span>
                            <span className="text-[11px] font-mono font-bold text-indigo-400 group-hover/link:underline flex items-center gap-1">
                              @VerseToken <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            </span>
                          </a>
                        </div>
                      </div>

                      <div className="h-px bg-blue-900/20" />

                      {/* Action buttons list */}
                      <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                        {/* Telegram Active Launch Button */}
                        <a 
                          href="https://t.me/GetVerse" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 transition-all transform active:scale-95 shadow-md flex-1 sm:flex-initial text-center justify-center cursor-pointer font-sans"
                        >
                          <Send className="w-4 h-4 fill-slate-950 rotate-45 transform -translate-x-0.5" /> Launch Group Chat
                        </a>

                        {/* Copy Link Button */}
                        <button 
                          onClick={handleCopyLink}
                          className="bg-sky-950/60 hover:bg-sky-90 text-slate-300 hover:text-white border border-sky-400/20 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all transform active:scale-95 shadow-md flex-1 sm:flex-initial text-center justify-center cursor-pointer"
                        >
                          {copiedLink ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" /> COPIED!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> COPY LINK
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              {/* Telegram Hub Description Introduction */}
              <div className="px-6 md:px-8 pt-4 pb-4">
                <div className="p-5 rounded-2xl bg-sky-955/10 border border-sky-400/10 text-slate-300 leading-relaxed text-xs sm:text-sm space-y-3">
                  <p className="font-semibold text-slate-205">
                    With 26 specialized topics, the Bitcoin.com Community Hub provides an organized environment where members can learn, build, collaborate, share ideas, access support, participate in regional communities, and contribute to the growth of the global Bitcoin.com and Verse ecosystem.
                  </p>
                  <p className="text-slate-400 text-xs">
                    Whether your interests lie in education, development, research, events, content creation, gaming, or community building, there is a dedicated space designed to help you connect, grow, and succeed within Web3. Expand topics row-by-row below to learn.
                  </p>
                </div>
              </div>

              {/* Topics Search Filter Bar */}
              <div className="px-6 md:px-8 py-3 flex items-center">
                <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 26 Topics..."
                    className="w-full bg-[#050b1a] border border-blue-900/50 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 outline-none rounded-2xl pl-12 pr-4 py-3 text-xs text-white placeholder-slate-500 font-semibold transition-all"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-sky-400 font-black font-mono hover:underline"
                    >
                      CLEAR
                    </button>
                  )}
                </div>
              </div>

              {/* Serial List of 26 Topics */}
              <div className="px-6 md:px-8 pb-8 pt-2 space-y-4 max-h-[850px] overflow-y-auto custom-scrollbar">
                {filteredTopics.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-slate-505 font-semibold text-sm">No topics found matching "{searchQuery}"</p>
                  </div>
                ) : (
                  filteredTopics.map((topic, index) => {
                    const isExpanded = expandedTopicId === topic.id;
                    return (
                      <div 
                        key={topic.id}
                        className={`border rounded-2xl transition-all ${
                          isExpanded 
                            ? 'bg-[#0e1735] border-sky-500/50 shadow-lg shadow-sky-500/5' 
                            : 'bg-[#080d22]/50 border-blue-900/30 hover:border-blue-900/60 hover:bg-[#0a112c]/65'
                        }`}
                      >
                        {/* Topic Row Header */}
                        <div 
                          onClick={() => selectTopic(topic.id)}
                          className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-3.5">
                            {/* Icon rendering logic */}
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden shadow-inner font-black">
                              {topic.iconType === 'symbol' && (
                                <div className={`w-full h-full flex items-center justify-center text-lg ${topic.iconBgColor} ${topic.iconTextColor}`}>
                                  {topic.iconValue}
                                </div>
                              )}
                              {topic.iconType === 'image' && (
                                <img 
                                  src={topic.iconValue} 
                                  alt={topic.name}
                                  className="w-full h-full object-cover p-0.5 bg-slate-900"
                                  referrerPolicy="no-referrer"
                                />
                              )}
                              {topic.iconType === 'text-bubble' && (
                                <div className={`w-full h-full flex flex-col items-center justify-center ${topic.iconBgColor} ${topic.iconTextColor} text-sm font-black`}>
                                  <span>{topic.iconValue}</span>
                                  <span className="text-[7px] leading-3 uppercase tracking-tighter opacity-80">chat</span>
                                </div>
                              )}
                            </div>

                            <div>
                              <span className="text-xs font-mono text-sky-400 font-bold uppercase tracking-widest block mb-0.5">Topic {topic.id}</span>
                              <h4 className="text-sm sm:text-base font-extrabold text-white group-hover:text-sky-300">
                                {topic.name}
                              </h4>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-sky-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-500" />
                            )}
                          </div>
                        </div>

                        {/* Expandable description body */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: 'easeOut' }}
                              className="overflow-hidden border-t border-blue-900/20"
                            >
                              <div className="p-5 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                                {/* Overview segment */}
                                <div className="space-y-1.5">
                                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#bd9471] font-black block">📖 Overview</span>
                                  <p className="bg-sky-950/20 border border-sky-400/5 p-4 rounded-xl font-normal text-slate-205">
                                    {topic.overview}
                                  </p>
                                </div>

                                {/* What you'll find here segment */}
                                <div className="space-y-2">
                                  <span className="text-[10px] uppercase font-mono tracking-widest text-sky-450 font-black block">🔍 What You'll Find Here</span>
                                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {topic.findHere.map((item, idx) => (
                                      <li key={idx} className="flex items-start gap-2 bg-[#050b1a]/40 p-2.5 rounded-lg border border-blue-900/10">
                                        <Send className="w-3.5 h-3.5 rotate-45 text-sky-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-slate-300 text-xs font-semibold">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Why it matters segment */}
                                <div className="space-y-1.5 pt-1">
                                  <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-black block">🌟 Why It Matters</span>
                                  <p className="bg-[#0f2122] border border-emerald-500/10 p-3.5 rounded-xl font-medium text-emerald-250 italic">
                                    {topic.whyMatters}
                                  </p>
                                </div>

                                {/* MORE DETAILS TOGGLE SECTION */}
                                <div className="pt-3 border-t border-blue-900/10 flex flex-col items-start gap-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setExpandedMoreDetailsTopicId(expandedMoreDetailsTopicId === topic.id ? null : topic.id);
                                    }}
                                    className="text-[11px] font-black tracking-widest text-sky-400 hover:text-sky-300 hover:underline uppercase transition-all flex items-center gap-1.5 cursor-pointer scale-100 active:scale-95"
                                  >
                                    {expandedMoreDetailsTopicId === topic.id ? '▲ Less Details' : '▼ More Details (বিস্তারিত দেখুন)'}
                                  </button>
                                  
                                  <AnimatePresence>
                                    {expandedMoreDetailsTopicId === topic.id && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                        animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                        transition={{ duration: 0.25, ease: "easeOut" }}
                                        className="overflow-hidden w-full bg-sky-950/20 border border-sky-400/10 rounded-xl p-4.5 text-xs text-slate-300 leading-relaxed font-normal"
                                      >
                                        <p className="font-extrabold text-sky-300 uppercase tracking-widest text-[9px] mb-1.5">📋 Detailed Discussion • বিস্তারিত আলোচনা</p>
                                        <p className="text-slate-200">
                                          {TOPIC_MORE_DETAILS[topic.id] || "Detailed guidelines, analysis schedules, and community plans for this topic are being updated regularly by our global managers."}
                                        </p>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Community Summary Telegram Footer Banner */}
              <div className="px-6 md:px-8 pb-8 pt-2">
                <div className="p-6 bg-gradient-to-r from-sky-950/35 to-indigo-950/35 border border-sky-500/15 rounded-[1.8rem] space-y-3">
                  <h4 className="text-sky-300 font-bold text-sm tracking-wider uppercase flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Community Hub Summary
                  </h4>
                  <p className="text-slate-350 leading-relaxed text-xs">
                    With 26 specialized topics, the Bitcoin.com Community Hub provides an organized environment where members can learn, build, collaborate, share ideas, access support, participate in regional communities, and contribute to the growth of the global Bitcoin.com and Verse ecosystem. Whether your interests lie in education, development, research, events, content creation, gaming, or community building, there is a dedicated space designed to help you connect, grow, and succeed within Web3.
                  </p>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
