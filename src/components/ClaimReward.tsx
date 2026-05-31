import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Info, 
  Flame, 
  Check, 
  Clock, 
  Gift, 
  Sparkles,
  Award,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface ClaimRewardProps {
  onBack: () => void;
  username: string;
  onClaimSuccess: (amount: number) => void;
  walletBalance: number;
}

// Custom hand-drawn cartoon style vector SVGs as requested
const WalletIllustration = () => (
  <svg viewBox="0 0 100 100" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="25" width="70" height="50" rx="12" fill="#C4B5FD" stroke="#2D3748" strokeWidth="2.5" />
    <path d="M45 25H75C80.5 25 85 29.5 85 35V45H45V25Z" fill="#B8A5E6" stroke="#2D3748" strokeWidth="2.5" />
    <path d="M55 45H85V65C85 70.5 80.5 75 75 75H55V45Z" fill="#B8A5E6" stroke="#2D3748" strokeWidth="2.5" />
    <rect x="65" y="42" width="22" height="16" rx="6" fill="#F97316" stroke="#2D3748" strokeWidth="2.5" />
    <circle cx="73" cy="50" r="3.5" fill="#FFFFFF" stroke="#2D3748" strokeWidth="1.5" />
    <circle cx="35" cy="45" r="4" fill="#F97316" />
    <circle cx="45" cy="55" r="3" fill="#FFFFFF" />
  </svg>
);

const GiftIllustration = () => (
  <svg viewBox="0 0 100 100" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="38" width="60" height="42" rx="10" fill="#C4B5FD" stroke="#2D3748" strokeWidth="2.5" />
    <rect x="16" y="26" width="68" height="14" rx="5" fill="#B8A5E6" stroke="#2D3748" strokeWidth="2.5" />
    <rect x="44" y="26" width="12" height="54" fill="#F97316" stroke="#2D3748" strokeWidth="2.5" />
    <path d="M38 14C30 14 30 26 44 26C44 26 42 14 38 14Z" fill="#F97316" stroke="#2D3748" strokeWidth="2.5" />
    <path d="M62 14C70 14 70 26 56 26C56 26 58 14 62 14Z" fill="#F97316" stroke="#2D3748" strokeWidth="2.5" />
    <circle cx="50" cy="24" r="5" fill="#FFFFFF" stroke="#2D3748" strokeWidth="2" />
  </svg>
);

const DiamondIllustration = () => (
  <svg viewBox="0 0 100 100" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 15L78 38L50 85L22 38L50 15Z" fill="#C4B5FD" stroke="#2D3748" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M50 15L35 38H65L50 15Z" fill="#B8A5E6" stroke="#2D3748" strokeWidth="2" strokeLinejoin="round" />
    <path d="M35 38L50 85L22 38H35Z" fill="#9F8AE2" stroke="#2D3748" strokeWidth="2" strokeLinejoin="round" />
    <path d="M65 38L50 85L78 38H65Z" fill="#B8A5E6" stroke="#2D3748" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="80" cy="25" r="4" fill="#F97316" stroke="#2D3748" strokeWidth="1.5" />
    <path d="M80 18V32M73 25H87" stroke="#2D3748" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const BookIllustration = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 30C15 22 25 22 50 26V76C25 72 15 72 15 80V30Z" fill="#C4B5FD" stroke="#2D3748" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M85 30C85 22 75 22 50 26V76C75 72 85 72 85 80V30Z" fill="#B8A5E6" stroke="#2D3748" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M22 38H40M22 46H40M22 54H40M22 62H40" stroke="#2D3748" strokeWidth="2" strokeLinecap="round" />
    <path d="M60 38H78M60 46H78M60 54H78M60 62H78" stroke="#2D3748" strokeWidth="2" strokeLinecap="round" />
    <path d="M50 26V86L45 80L50 76" fill="#F97316" stroke="#2D3748" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const ChartIllustration = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="15" width="70" height="70" rx="14" fill="#C4B5FD" stroke="#2D3748" strokeWidth="2.5" />
    <path d="M25 35H75M25 50H75M25 65H75" stroke="#B8A5E6" strokeWidth="1.5" strokeDasharray="3 3" />
    <path d="M25 65L40 45L55 55L75 25" stroke="#2D3748" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="25" cy="65" r="4.5" fill="#F97316" stroke="#2D3748" strokeWidth="2" />
    <circle cx="40" cy="45" r="4.5" fill="#FFFFFF" stroke="#2D3748" strokeWidth="2" />
    <circle cx="55" cy="55" r="4.5" fill="#F97316" stroke="#2D3748" strokeWidth="2" />
    <circle cx="75" cy="25" r="6" fill="#F97316" stroke="#2D3748" strokeWidth="2" />
  </svg>
);

const EyeWatcherIllustration = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 50C15 50 30 25 50 25C70 25 85 50 85 50C85 50 70 75 50 75C30 75 15 50 15 50Z" fill="#FFFFFF" stroke="#2D3748" strokeWidth="2.5" strokeLinejoin="round" />
    <circle cx="50" cy="50" r="18" fill="#C4B5FD" stroke="#2D3748" strokeWidth="2" />
    <circle cx="50" cy="50" r="10" fill="#F97316" stroke="#2D3748" strokeWidth="2" />
    <circle cx="46" cy="46" r="3.5" fill="#FFFFFF" />
    <circle cx="80" cy="22" r="10" fill="#B8A5E6" stroke="#2D3748" strokeWidth="2" />
    <path d="M80 17V27M77 20H83" stroke="#2D3748" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const StarIllustration = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 12L62 38L90 41L68 60L75 87L50 73L25 87L32 60L10 41L38 38L50 12Z" fill="#C4B5FD" stroke="#2D3748" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M50 12L38 38L10 41L32 60L25 87L50 73V12Z" fill="#B8A5E6" stroke="#2D3748" strokeWidth="1" strokeLinejoin="round" />
    <circle cx="75" cy="25" r="4" fill="#F97316" stroke="#2D3748" strokeWidth="1.5" />
    <circle cx="20" cy="70" r="3" fill="#FFFFFF" stroke="#2D3748" strokeWidth="1" />
  </svg>
);

const GoldBitcoinIllustration = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="36" fill="#F97316" stroke="#2D3748" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="28" fill="#C4B5FD" stroke="#2D3748" strokeWidth="2" />
    <path d="M43 32H55C59.5 32 63 35.5 63 40C63 43.5 60.5 46 57 47C61.5 48 64 51 64 55C64 59.5 60.5 63 55 63H43V32Z" fill="#B8A5E6" stroke="#2D3748" strokeWidth="2" />
    <path d="M43 32V63" stroke="#2D3748" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M49 26V32M55 26V32M49 63V69M55 63V69" stroke="#2D3748" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

interface Quest {
  id: string;
  title: string;
  currentProgress: number;
  targetProgress: number;
  isCompleted: boolean;
  illustration: React.ReactNode;
}

export default function ClaimReward({ onBack, username, onClaimSuccess, walletBalance }: ClaimRewardProps) {
  
  // 1. Initial EXP state (Defaults to 0 for a brand new user as requested)
  const [userEXP, setUserEXP] = useState<number>(() => {
    const saved = localStorage.getItem(`verse_user_exp_${username}`);
    return saved ? parseInt(saved) : 0;
  });

  // Level badge dynamic state (computed as Math.floor(userEXP / 1000) or starts at 0)
  const currentLvl = Math.floor(userEXP / 1000);

  // 1. Initial Gems state (Defaults to 0 for a brand new user as requested)
  const [gemsCount, setGemsCount] = useState<number>(() => {
    const g = localStorage.getItem(`verse_gems_${username}`);
    return g ? parseInt(g) : 0;
  });

  // Daily Streak claim tracker
  const [currentStreakIndex, setCurrentStreakIndex] = useState<number>(() => {
    const saved = localStorage.getItem(`verse_streak_day_index_${username}`);
    return saved ? parseInt(saved) : 0; // Days 1 to 7 corresponding index (0 to 6)
  });

  const [hasClaimedTodayCheckin, setHasClaimedTodayCheckin] = useState<boolean>(() => {
    const lastCheckin = localStorage.getItem(`verse_last_checkin_date_${username}`);
    if (!lastCheckin) return false;
    // Check if same calendar day
    const lastDateString = new Date(parseInt(lastCheckin)).toDateString();
    const currentDateString = new Date().toDateString();
    return lastDateString === currentDateString;
  });

  // Ticking time left for Quest Reset (3 Days countdown matches: 2D 23:56:25)
  // Let the countdown represent seconds total: 258985 (which is 2D 23:56:25)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    const savedFuture = localStorage.getItem(`verse_quest_countdown_future_${username}`);
    if (savedFuture) {
      const diff = Math.floor((parseInt(savedFuture) - Date.now()) / 1000);
      if (diff > 0) {
        return diff;
      } else {
        // Active timer has expired! Reset to 14 days cycle (1,209,600 seconds)
        const cycleDuration = 1209600; // 14 Days
        const future = Date.now() + cycleDuration * 1000;
        localStorage.setItem(`verse_quest_countdown_future_${username}`, future.toString());
        localStorage.setItem(`verse_quest_14d_cycle_active_${username}`, 'true');
        return cycleDuration;
      }
    } else {
      // First run: let's start with the initialized 2D 23:56:25 countdown (258,985 seconds)
      const future = Date.now() + 258985 * 1000;
      localStorage.setItem(`verse_quest_countdown_future_${username}`, future.toString());
      localStorage.setItem(`verse_quest_14d_cycle_active_${username}`, 'false');
      return 258985;
    }
  });

  // Quests structure incorporating the user's explicit targets: 1/3, 1/4, 1/7, 1/9, 1/11, 1/13
  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem(`verse_quest_progress_new_${username}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((q: any) => ({
          ...q,
          illustration: getIllustrationForId(q.id)
        }));
      } catch (e) {
        // Fallback
      }
    }
    // Set matching targets as requested
    return [
      { id: 'news_buff', title: 'Daily News Buff', currentProgress: 1, targetProgress: 3, isCompleted: false, illustration: <BookIllustration /> },
      { id: 'btc_seeker', title: 'BTC Price Seeker', currentProgress: 1, targetProgress: 4, isCompleted: false, illustration: <ChartIllustration /> },
      { id: 'crypto_expert', title: 'Crypto Knowledge Expert', currentProgress: 1, targetProgress: 7, isCompleted: false, illustration: <StarIllustration /> },
      { id: 'btc_watcher', title: 'Bitcoin Watcher Elite', currentProgress: 1, targetProgress: 9, isCompleted: false, illustration: <EyeWatcherIllustration /> },
      { id: 'news_aficionado', title: 'News Aficionado', currentProgress: 1, targetProgress: 11, isCompleted: false, illustration: <BookIllustration /> },
      { id: 'tracker_pro', title: 'Market Tracker Pro', currentProgress: 1, targetProgress: 13, isCompleted: false, illustration: <GoldBitcoinIllustration /> },
    ];
  });

  const [notificationReward, setNotificationReward] = useState<string | null>(null);
  const [levelUpModalScore, setLevelUpModalScore] = useState<number | null>(null);

  // Dynamically updating total rewards starting at 7681.29
  const [totalRewardsDisbursed, setTotalRewardsDisbursed] = useState<number>(() => {
    const saved = localStorage.getItem('verse_total_rewards_disbursed');
    return saved ? parseFloat(saved) : 7681.29;
  });

  // Helper mapping
  function getIllustrationForId(id: string) {
    switch (id) {
      case 'news_buff': return <BookIllustration />;
      case 'btc_seeker': return <ChartIllustration />;
      case 'crypto_expert': return <StarIllustration />;
      case 'btc_watcher': return <EyeWatcherIllustration />;
      case 'news_aficionado': return <BookIllustration />;
      case 'tracker_pro': return <GoldBitcoinIllustration />;
      default: return <BookIllustration />;
    }
  }

  // Ticker timer for real-time natural countdown decrement
  useEffect(() => {
    const timer = setInterval(() => {
      const savedFuture = localStorage.getItem(`verse_quest_countdown_future_${username}`);
      if (!savedFuture) return;

      const diff = Math.floor((parseInt(savedFuture) - Date.now()) / 1000);
      if (diff <= 0) {
        // Reset countdown to a 14-day loop (1,209,600 seconds)
        const cycleDuration = 1209600; // 14 Days
        const future = Date.now() + cycleDuration * 1000;
        localStorage.setItem(`verse_quest_countdown_future_${username}`, future.toString());
        localStorage.setItem(`verse_quest_14d_cycle_active_${username}`, 'true');
        setRemainingSeconds(cycleDuration);

        // Also let quests auto-reset if fully compiled, so they can keep playing the 14-days cycle!
        setQuests(prev => prev.map(q => ({
          ...q,
          currentProgress: 1,
          isCompleted: false
        })));
        setNotificationReward("✨ 14-Day Cycle Triggered! Daily quests have refreshed with new timeline progress milestones.");
      } else {
        setRemainingSeconds(diff);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [username]);

  // Persists stats
  useEffect(() => {
    localStorage.setItem(`verse_user_exp_${username}`, userEXP.toString());
  }, [userEXP, username]);

  useEffect(() => {
    localStorage.setItem(`verse_gems_${username}`, gemsCount.toString());
  }, [gemsCount, username]);

  useEffect(() => {
    const dataToSave = quests.map(({ illustration, ...rest }) => rest);
    localStorage.setItem(`verse_quest_progress_new_${username}`, JSON.stringify(dataToSave));
  }, [quests, username]);

  // Real-time ticking total rewards disbursement incrementor
  useEffect(() => {
    const timer = setInterval(() => {
      setTotalRewardsDisbursed(prev => {
        const nextVal = prev + (Math.random() * 0.12 + 0.04);
        localStorage.setItem('verse_total_rewards_disbursed', nextVal.toFixed(2));
        return nextVal;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const formatTimerString = (sec: number) => {
    const days = Math.floor(sec / 86400);
    const hrs = Math.floor((sec % 86400) / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${days}D ${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Cheat/simulation button: passing 1 day (24H duration) decrements countdown & increments quest metrics
   */
  const handleSimulateDayPass = () => {
    const savedFuture = localStorage.getItem(`verse_quest_countdown_future_${username}`);
    const currentFuture = savedFuture ? parseInt(savedFuture) : Date.now();

    // Shorten real-world future target by 24h
    const newFuture = currentFuture - 86400000;
    localStorage.setItem(`verse_quest_countdown_future_${username}`, newFuture.toString());

    const diff = Math.floor((newFuture - Date.now()) / 1000);
    if (diff <= 0) {
      // Transition to 14 days cycle directly
      const cycleDuration = 1209600; // 14 Days
      const future = Date.now() + cycleDuration * 1000;
      localStorage.setItem(`verse_quest_countdown_future_${username}`, future.toString());
      localStorage.setItem(`verse_quest_14d_cycle_active_${username}`, 'true');
      setRemainingSeconds(cycleDuration);

      // Reset quests progress to initial 1 day
      setQuests(prev => prev.map(q => ({
        ...q,
        currentProgress: 1,
        isCompleted: false
      })));
      setNotificationReward("✨ Countdown expired! Auto-transitioned to the recurring 14-Day Cycle.");
    } else {
      setRemainingSeconds(diff);
      
      // Increment quest progresses by 1 day as the simulated countdown day passes
      setQuests(prev => prev.map(quest => {
        if (!quest.isCompleted) {
          const nextProgress = Math.min(quest.currentProgress + 1, quest.targetProgress);
          return {
            ...quest,
            currentProgress: nextProgress
          };
        }
        return quest;
      }));
    }

    // Unlock today's checkin for testing convenience
    setHasClaimedTodayCheckin(false);

    setNotificationReward("⚡ Test Mode: 24 Hours elapsed! Countdown shortened & active quest day progress incremented!");
  };

  /**
   * Claims check-in rewards daily with growing Verse metrics & 1500 EXP
   */
  const handleDailyCheckin = () => {
    if (hasClaimedTodayCheckin) {
      alert("You have already checked-in today! Please return tomorrow or use '⚡ Simulate Day Pass' for sandbox testing.");
      return;
    }

    // Growing rewards based on the consecutive days
    const dayIndex = currentStreakIndex;
    const baseVerseReward = 500 + dayIndex * 150; // starts at 500, then 650, 800, etc.
    const baseEXPReward = 1500 + dayIndex * 300;  // starts at 1500, then 1800, 2100, etc.

    const prevLevel = Math.floor(userEXP / 1000);
    const nextEXP = userEXP + baseEXPReward;
    const nextLevel = Math.floor(nextEXP / 1000);

    // Save and commit
    setUserEXP(nextEXP);
    setGemsCount(g => g + 2);
    setHasClaimedTodayCheckin(true);
    localStorage.setItem(`verse_last_checkin_date_${username}`, Date.now().toString());

    const nextStreakIndex = (currentStreakIndex + 1) % 7;
    setCurrentStreakIndex(nextStreakIndex);
    localStorage.setItem(`verse_streak_day_index_${username}`, nextStreakIndex.toString());

    // Send VERSE to outer central wallet balance
    onClaimSuccess(baseVerseReward);

    if (nextLevel > prevLevel) {
      setLevelUpModalScore(nextLevel);
    } else {
      setNotificationReward(`🎉 Daily Check-In claimed! Received +${baseVerseReward} VERSE, +${baseEXPReward} EXP and +2 Gems.`);
    }
  };

  /**
   * Action trigger below each quest card to claim Level-based rewards once targets (3, 4, 7... days) are achieved
   */
  const handleClaimQuestReward = (e: React.MouseEvent, quest: Quest) => {
    e.stopPropagation(); // prevent card container double-firing

    if (quest.currentProgress < quest.targetProgress) {
      alert(`Quest incomplete. It requires ${quest.targetProgress} days connected. Please let the countdown decrease (or click the simulation trigger above).`);
      return;
    }

    // Base multiplier reward depending on their actual account Level:
    // Level 0 gets 300 VERSE, higher levels get increased payouts!
    const rewardPayout = 500 + currentLvl * 250;

    // Grants rewards to external central wallet (Verse Wallet dashboard)
    onClaimSuccess(rewardPayout);

    // Grant 10 gems also as premium incentive
    setGemsCount(g => g + 10);

    // Flag as complete
    setQuests(prev => prev.map(q => {
      if (q.id === quest.id) {
        return { ...q, isCompleted: true };
      }
      return q;
    }));

    setNotificationReward(`🏆 Quest Resolved! Received ${rewardPayout} VERSE and +10 Gems. Directly synchronized with your Total Verse Wallet balance!`);
  };

  const targetEXPForLevelUp = 1500;
  const emailMasked = username.includes('@') 
    ? username.split('@')[0].slice(0, 6) + '...' + username.split('@')[1]
    : username;

  return (
    <div className="bg-[#F2F2F5] min-h-screen text-slate-900 p-4 sm:p-6 md:p-8 rounded-[25px] border border-slate-300/40 overflow-hidden relative shadow-inner">
      
      {/* 2. REWARDS HEADER SECTION */}
      <div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-6 relative z-10 select-none">
        {/* Left Side: Close button */}
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm border border-slate-200/50 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Center Title */}
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          Rewards
          <img 
            src="https://i.ibb.co.com/XxcwjvBq/Screenshot-2026-05-31-14-49-38-518-com-bitcoin-mwallet-edit.jpg" 
            alt="Rewards Emblem" 
            className="w-7 h-7 object-cover rounded-lg border border-purple-300 shadow-sm"
            referrerPolicy="no-referrer"
          />
        </h2>

        {/* Right Side: Blue Information (i) icon */}
        <button
          onClick={() => {
            alert("Rewards & Daily Quest Portal: Let the active countdown timer pass days naturally or click '⚡ Simulate Day Pass' to test. Completed days fill progress (1/3, 1/4...). Once fully completed, claim hefty VERSE tokens relative to your level directly to your Verse Wallet!");
          }}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm border border-slate-200/50 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Info className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      <div className="space-y-5 w-full max-w-2xl mx-auto pb-12 relative z-10">

        {/* 12. REWARDS LANDING WIDGET (Large Center Illustration) */}
        <div className="bg-white rounded-[24px] p-6 text-center shadow-sm border border-slate-200/40 flex flex-col items-center gap-3">
          <div className="p-4 bg-purple-50 rounded-full border border-purple-100">
            <GiftIllustration />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center justify-center gap-2">
              REWARDS
              <img 
                src="https://i.ibb.co.com/XxcwjvBq/Screenshot-2026-05-31-14-49-38-518-com-bitcoin-mwallet-edit.jpg" 
                alt="Rewards Center Emblem" 
                className="w-8 h-8 object-cover rounded-lg border border-purple-300 shadow-sm"
                referrerPolicy="no-referrer"
              />
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
              Complete quests to unlock rewards
            </p>
          </div>
        </div>

        {/* SANDBOX SPEEDUP TESTING SUITE HEADER (Highly requested for proof-of-work) */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-amber-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <div className="text-left">
              <span className="text-xs font-bold block">Developer Quest Sandbox Controller</span>
              <span className="text-[10px] text-amber-800">Reviewers can fast-forward 24H countdowns to test fractions & claim mechanics!</span>
            </div>
          </div>
          <button
            onClick={handleSimulateDayPass}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-mono font-black text-xs rounded-xl shadow transition-all cursor-pointer flex-shrink-0"
          >
            ⚡ Simulate 1 Day Pass
          </button>
        </div>

        {/* 3. USER PROFILE CARD */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-200/40 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            {/* Left Side: Wallet Illustration */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#FAF5EC] flex items-center justify-center border border-[#E9D8B6]/30 flex-shrink-0">
                <WalletIllustration />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-[#1E1B4B] text-white font-mono text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    Lvl {currentLvl}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                    {emailMasked}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-400">
                  0x8f42...e12929
                </p>
              </div>
            </div>

            {/* Right Side: EXP Text */}
            <div className="text-right">
              <span className="text-sm font-black text-slate-800 font-sans block">
                {userEXP.toLocaleString()} EXP
              </span>
              <span className="text-[10px] text-slate-400 font-bold font-mono">
                Level range goal
              </span>
            </div>
          </div>

          {/* Horizontal Progress Bar */}
          <div className="space-y-1">
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((userEXP / targetEXPForLevelUp) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono font-black text-slate-400">
              <span>{Math.floor((userEXP / targetEXPForLevelUp) * 100)}% progress</span>
              <span>1,500 EXP limit</span>
            </div>
          </div>
        </div>

        {/* 4. REWARD STATISTICS CARDS (Grid) */}
        <div className="grid grid-cols-2 gap-4">
          {/* Total Rewards Card */}
          <div className="bg-white rounded-[24px] p-5 shadow-sm border border-[#e2e8f0]/45 flex flex-col justify-between gap-4">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100">
              <Gift className="w-5 h-5 text-[#F97316] stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Rewards
              </span>
              <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                US${totalRewardsDisbursed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-[9px] text-slate-400 font-semibold leading-tight">
                Disbursed to all users last season
              </p>
            </div>
          </div>

          {/* Gems Card */}
          <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-200/40 flex flex-col justify-between gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100">
              <DiamondIllustration />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Gems Balance
              </span>
              <p className="text-3xl font-black text-slate-900">
                {gemsCount}
              </p>
              <p className="text-[9px] text-slate-400 font-semibold leading-tight">
                Used to upgrade custom mining speed
              </p>
            </div>
          </div>
        </div>

        {/* 5. STREAK SECTION */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-200/40 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-md sm:text-lg font-black text-slate-900 font-sans uppercase tracking-tight">
                Streak Check-In
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Consecutive daily check-in rewards & EXP scaling</p>
            </div>
            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-700 px-3 py-1 rounded-full font-black text-xs">
              <span>{17 + currentStreakIndex}</span>
              <Flame className="w-4 h-4 text-orange-600 fill-orange-500" />
            </div>
          </div>

          {/* Weekly Check-in Row with Green tick design completed */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {[
              { day: 'Mon', index: 0 },
              { day: 'Tue', index: 1 },
              { day: 'Wed', index: 2 },
              { day: 'Thu', index: 3 },
              { day: 'Fri', index: 4 },
              { day: 'Sat', index: 5 },
              { day: 'Sun', index: 6 }
            ].map((d) => {
              const checked = d.index <= currentStreakIndex;
              return (
                <div key={d.day} className="flex flex-col items-center gap-2">
                  <span className="text-[10px] sm:text-xs text-slate-400 font-black font-mono uppercase">{d.day}</span>
                  {checked ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-emerald-400 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-300" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Action checkin button */}
          <div className="pt-2">
            <button
              onClick={handleDailyCheckin}
              disabled={hasClaimedTodayCheckin}
              className={`w-full py-3.5 rounded-xl font-black text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2 select-none ${
                hasClaimedTodayCheckin 
                  ? 'bg-slate-100 text-slate-400 border border-slate-250 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-md shadow-emerald-500/20 cursor-pointer'
              }`}
            >
              {hasClaimedTodayCheckin ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  Today Check-in Claimed
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 animate-bounce" />
                  Claim Day {currentStreakIndex + 1} Check-In (+{500 + currentStreakIndex * 150} VERSE)
                </>
              )}
            </button>
          </div>
        </div>

        {/* 6. DAILY QUEST SECTION WITH SOFT PURPLE BACKGROUND */}
        <div className="bg-[#B8A5E6] rounded-[30px] p-5 sm:p-6 shadow-md border border-[#9b85cf] relative overflow-hidden flex flex-col gap-6">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl pointer-events-none" />

          {/* 7. COUNTDOWN TIMER */}
          <div className="flex justify-center -mt-2">
            <div className="bg-white px-5 py-2.5 rounded-full shadow-md flex items-center gap-2 border border-purple-200/40">
              <Clock className="w-4 h-4 text-purple-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-xs sm:text-sm font-black text-slate-800 font-mono tracking-widest">
                {formatTimerString(remainingSeconds)}
              </span>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              DAILY QUESTS
            </h3>
            <p className="text-[10px] text-indigo-950 font-black uppercase tracking-widest mt-1">
              Fractions represent countdown days elapsed. Tap CLAIM once mature!
            </p>
          </div>

          {/* 8. QUEST CARDS DESIGN GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quests.map((quest) => {
              const percentage = (quest.currentProgress / quest.targetProgress) * 100;
              const isProgressFull = quest.currentProgress >= quest.targetProgress;

              return (
                <div
                  key={quest.id}
                  className="bg-[#D9CEF5] hover:bg-[#D5CAF3] transition-colors rounded-[24px] p-4.5 shadow-sm flex flex-col justify-between gap-4 border border-[#AB97DC]/30 relative group select-none"
                >
                  <div className="flex items-start gap-4">
                    {/* Large White Rounded Box for illustration */}
                    <div className="w-18 h-18 rounded-2xl bg-white flex items-center justify-center border-2 border-[#8165D4]/20 p-2 flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                      {quest.illustration}
                    </div>

                    <div className="space-y-1 pr-1.5 flex-1">
                      <h4 className="text-[15px] sm:text-[16px] font-black leading-tight text-slate-900 font-sans">
                        {quest.title}
                      </h4>
                      <p className="text-[10px] font-mono uppercase tracking-widest font-black text-[#5B40BA]/80">Quest Objective</p>
                    </div>
                  </div>

                  {/* 9. PROGRESS BAR DESIGN & 10. CLAIM OPTION BAR */}
                  <div className="space-y-2 pt-1 border-t border-purple-300/20">
                    <div className="flex justify-between items-center text-[10px] font-mono font-black text-indigo-950">
                      <span>DAYS COMPLETED</span>
                      <span>{quest.currentProgress}/{quest.targetProgress}</span>
                    </div>
                    
                    <div className="w-full h-2.5 bg-white rounded-full overflow-hidden p-[2px]">
                      <div 
                        className="h-full bg-[#5B40BA] rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    {/* Claim Option Button below card as requested */}
                    <div className="pt-1.5">
                      {quest.isCompleted ? (
                        <div className="w-full py-2 bg-purple-650/10 border border-purple-500/20 text-purple-700 rounded-xl flex items-center justify-center gap-1 text-xs font-black">
                          <Check className="w-3.5 h-3.5 text-purple-600 stroke-[3]" />
                          <span>✓ Done & Claimed</span>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => handleClaimQuestReward(e, quest)}
                          className={`w-full py-2 text-xs font-black tracking-wide uppercase transition-all rounded-xl border flex items-center justify-center gap-1 cursor-pointer ${
                            isProgressFull
                              ? 'bg-purple-600 text-white hover:bg-purple-500 border-purple-500 shadow-md animate-pulse'
                              : 'bg-slate-200/55 text-slate-500 border-slate-300/40 cursor-not-allowed'
                          }`}
                        >
                          {isProgressFull ? 'CLAIM VERSE REWARD' : `CLAIM LOCKED (${quest.currentProgress}/${quest.targetProgress})`}
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* REWARD TO NOTIFY PROGRESS INCREMENT & BONUS GAIN */}
      <AnimatePresence>
        {notificationReward && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 left-4 right-4 z-50 max-w-md mx-auto"
          >
            <div className="bg-slate-900 border-2 border-emerald-500 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-3 text-white">
              <span className="text-xs sm:text-sm font-semibold">{notificationReward}</span>
              <button
                onClick={() => setNotificationReward(null)}
                className="text-[10px] font-mono font-black uppercase text-emerald-400 border border-emerald-400/30 px-2.5 py-1 rounded"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEVEL UP POPUP CELEBRATION MODAL */}
      <AnimatePresence>
        {levelUpModalScore !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white border-2 border-[#5B40BA] rounded-[2.5rem] p-8 max-w-md w-full text-center relative overflow-hidden shadow-2xl space-y-6"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative z-10 space-y-2">
                <div className="w-20 h-20 rounded-full bg-purple-50 border-2 border-purple-200 flex items-center justify-center mx-auto mb-4 relative">
                  <Award className="w-10 h-10 text-purple-600 animate-spin" style={{ animationDuration: '8s' }} />
                  <Sparkles className="w-6 h-6 absolute top-1 right-1 text-amber-500 animate-bounce" />
                </div>
                
                <span className="text-[10.5px] font-mono tracking-widest font-black uppercase text-purple-700 bg-purple-100 px-3.5 py-1.5 rounded-full">
                  LEVEL UP ACCOMPLISHED!
                </span>
                
                <h3 className="text-3xl font-black text-slate-900 mt-3">Level {levelUpModalScore} Reach!</h3>
                <p className="text-sm text-slate-500">
                  Awesome progression! You advanced to Account Level <span className="font-bold text-purple-700">{levelUpModalScore}</span>. Your base multiplier for active Daily claim quests has officially increased.
                </p>

                <div className="p-4 bg-[#FAF5EC] border border-[#E9D8B6]/40 rounded-2xl text-left space-y-1 mt-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase font-mono">
                    <TrendingUp className="w-4 h-4" /> Multiplier Yield Buff
                  </div>
                  <p className="text-xs text-amber-900 font-semibold">Your quest rewards are now scaled to: <span className="font-extrabold text-slate-950 font-mono">{500 + levelUpModalScore * 250} VERSE tokens</span> per day claimed!</p>
                </div>
              </div>

              <div className="relative z-10 pt-4">
                <button
                  onClick={() => setLevelUpModalScore(null)}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-black tracking-wider rounded-xl uppercase transition-colors shadow-lg cursor-pointer shadow-purple-600/20"
                >
                  Claim Level Bonus & Continue
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
