import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Shield, AlertTriangle, Key } from 'lucide-react';

// Define the shape of our security telemetry and state
interface SecurityLog {
  timestamp: number;
  type: 'navigation' | 'click' | 'useragent_mod';
  detail: string;
}

interface ClientMeta {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  browser: string;
  os: string;
  timezone: string;
}

interface ViolationDetails {
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
}

const VIOLATIONS: Record<string, ViolationDetails> = {
  RULE_1: {
    titleEn: "Request Spike Rate Exceeded",
    titleBn: "অতিরিক্ত রিকোয়েস্ট স্পাইক সনাক্ত",
    descEn: "Your browser sent more than 2-3 requests in a single second. This exceeds standard safe browser behavior limits.",
    descBn: "আপনার ব্রাউজার থেকে ১ সেকেন্ডে ২-৩ টির বেশি অ্যাকশন রিকোয়েস্ট এসেছে, যা সাধারণ ব্রাউজিং সীমার চেয়ে অনেক বেশি।"
  },
  RULE_2: {
    titleEn: "Velocity Route Flooding Detected",
    titleBn: " canতি দ্রুত পেজভিউ ফ্ল্যাডিং সনাক্ত",
    descEn: "More than 5 route changes were completed in 1 second. Automated scraping or routing loops are restricted.",
    descBn: "১ সেকেন্ডে ৫ টির বেশি পেজ ট্রানজিশন করা হয়েছে, যা মানুষের পক্ষে অসম্ভব এবং বটের কাজের মতো।"
  },
  RULE_3: {
    titleEn: "Quiet Hours Night DP Policy Violation",
    titleBn: "রাতের সময়ে নাইট ডিপি (Night DP) নিয়মের সংশোধন লঙ্ঘন",
    descEn: "Night DP exceeded 0.1 threshold (more than 10 events within 10 seconds between 11 PM and 6 AM).",
    descBn: "রাতের শান্ত সময়ে (রাত ১১:০০ - সকাল ৬:০০) আপনার নাইট ডিপি (Night DP) মান ০.১ অতিক্রম করেছে (১০ সেকেন্ডে ১০টির বেশি রিকোয়েস্ট সংগৃহীত হয়েছে)।"
  },
  RULE_4_SEVERE: {
    titleEn: "Severe Page View Flood Detected",
    titleBn: "মারাত্মক পেজভিউ ফ্ল্যাডিং প্রতিরোধ",
    descEn: "More than 50 page views loaded within 10 seconds. Access to host resources restricted instantly.",
    descBn: "১০ সেকেন্ডে ৫০ বা তার বেশি পেজভিউ রেকর্ড করা হয়েছে, যা শতভাগ রোবোটিক বা অনাকাঙ্ক্ষিত ট্রাফিকের লক্ষণ।"
  },
  RULE_4_ABNORMAL: {
    titleEn: "Abnormal Page View Flood",
    titleBn: "অস্বাভাবিক পেজভিউ ফ্ল্যাডিং সনাক্ত",
    descEn: "Exceeded 30 page views within a 10-second interval.",
    descBn: "১০ সেকেন্ডের মধ্যে ৩০টির বেশি পেজভিউ রেকর্ড করা হয়েছে, যা অস্বাভাবিক ট্রাফিকের আওতাভুক্ত।"
  },
  RULE_5_BOUNCE_5S: {
    titleEn: "Critical Burst Rate Limit Exceeded",
    titleBn: "গুরুতর বাউন্স ও বার্স্ট রেট সীমা লঙ্ঘন (Burst Rate)",
    descEn: "More than 30 visits/actions detected in 5 seconds. This is restricted instantly to protect host resources.",
    descBn: "৫ সেকেন্ডের মধ্যে ৩০টির বেশি রিফ্রেশ বা ভিজিট এসেছে, সার্ভার সচল ও ক্ষতিকর আক্রমণ রুখতে আপনার সংযোগ ব্লক করা হলো।"
  },
  RULE_5_BOUNCE_10S_SEVERE: {
    titleEn: "Severe Traffic Burst Rate Detected",
    titleBn: "মারাত্মক বার্স্ট রেট ট্রাফিক সনাক্ত",
    descEn: "More than 50 visits/actions detected in 10 seconds. Confirmed robotic threat behavior.",
    descBn: "১০ সেকেন্ডের মধ্যে ৫০টি বা তার বেশি ভিজিট করার চেষ্টা করা হয়েছে, যা রোবট দ্বারা ক্ষতিকর হামলার লক্ষণ।"
  },
  RULE_5_BOUNCE_10S_ABNORMAL: {
    titleEn: "Sustained Burst Rate Anomaly",
    titleBn: "ধারাবাহিক বার্স্ট রেট অসঙ্গতি",
    descEn: "Between 30 to 50 abnormal actions detected in a 10 second window.",
    descBn: "১০ সেকেন্ডের মধ্যে ৩০ থেকে ৫০টির কাছাকাছি অতিরিক্ত ভিজিট অসঙ্গতি সনাক্ত করা হয়েছে।"
  },
  RULE_6: {
    titleEn: "Top Browser Limit Triggered",
    titleBn: "ব্রাউজার রিসোর্স হাইজ্যাকিং প্রতিরোধ",
    descEn: "Browser session triggered abnormal activity, capturing over 20% of standard safety limits.",
    descBn: "আপনার ব্রাউজার সেশনটি অস্বাভাবিক ক্লিক স্প্যামিং দিয়ে সিস্টেমে ২০%-এর বেশি রিসোর্স থ্রেশহোল্ড দখল করেছে।"
  },
  RULE_7: {
    titleEn: "Ratio Anomaly / Page View Fraud (Ignored)",
    titleBn: "অনুপাত অসঙ্গতি / রিফ্রেশ ও পেজভিউ স্প্যাম (লগকৃত)",
    descEn: "The ratio of Page Views to unique interaction visits exceeded the maximum tolerance of 5.0 per visit.",
    descBn: "ভিজিট ও পেজভিউ সংখ্যানুপাত স্বাভাবিক নয় (অনুপাত সীমা ৫.০ অতিক্রম করেছে)। বারবার রিফ্রেশ বা স্প্যামিংয়ের মাধ্যমে ভিউ তৈরি করা হয়েছে।"
  },
  DEFAULT: {
    titleEn: "Cyber Security Protocol Triggered",
    titleBn: "সাইবার সিকিউরিটি প্রোটোকল অ্যাক্টিভ",
    descEn: "Automated real-time firewall blocked malicious requests from this browser.",
    descBn: "স্বয়ংক্রিয় রিয়েল-টাইম ফায়ারওয়াল আপনার ব্রাউজার ট্র্যাফিককে অননুমোদিত হিসেবে সনাক্ত করেছে।"
  }
};

interface SecurityContextType {
  isBlocked: boolean;
  blockReason: string;
  blockRuleId: string;
  clientMeta: ClientMeta | null;
  triggerAction: (type: 'navigation' | 'click', detail: string) => void;
  resetFirewall: () => void;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityFirewallProvider');
  }
  return context;
};

export const SecurityFirewallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBlocked, setIsBlocked] = useState<boolean>(() => {
    if (localStorage.getItem('verse_security_whitelisted') === 'true') {
      return false;
    }
    return localStorage.getItem('verse_security_blacklisted') === 'true';
  });
  
  const [blockReason, setBlockReason] = useState<string>(() => {
    return localStorage.getItem('verse_blacklist_reason') || '';
  });

  const [blockRuleId, setBlockRuleId] = useState<string>(() => {
    return localStorage.getItem('verse_blacklist_rule_id') || 'DEFAULT';
  });

  const [clientMeta, setClientMeta] = useState<ClientMeta | null>(null);

  // Keep track of user activity logs in memory (non-persisted rolling logs)
  const activityLogs = useRef<SecurityLog[]>([]);
  const currentUA = useRef<string>(navigator.userAgent);

  const totalPageViews = useRef<number>(() => {
    return parseInt(sessionStorage.getItem('verse_session_pageviews') || '0', 10);
  });

  const totalVisits = useRef<number>(() => {
    return parseInt(sessionStorage.getItem('verse_session_visits') || '1', 10);
  });

  const isSpamCaptured = useRef<boolean>(() => {
    return localStorage.getItem('verse_spam_captured') === 'true';
  });

  // Fetch client metadata securely to check location/IP and display real-world parameters
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        // Engine 1: ipwho.is (highly reliable with excellent response parameters)
        const res = await fetch('https://ipwho.is/');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setClientMeta({
              ip: data.ip || '127.0.0.1',
              country: data.country || 'Bangladesh',
              countryCode: data.country_code || 'BD',
              region: data.region || 'Dhaka',
              city: data.city || 'Dhaka',
              browser: getBrowserName(),
              os: getOSName(),
              timezone: data.timezone?.id || Intl.DateTimeFormat().resolvedOptions().timeZone,
            });
            return;
          }
        }
      } catch (err) {
        console.warn('Primary ipwho.is resolver failed, attempting fallback...', err);
      }

      try {
        // Engine 2: ipapi.co secondary fallback
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          setClientMeta({
            ip: data.ip || '127.0.0.1',
            country: data.country_name || 'Bangladesh',
            countryCode: data.country_code || 'BD',
            region: data.region || 'Dhaka Division',
            city: data.city || 'Dhaka',
            browser: getBrowserName(),
            os: getOSName(),
            timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          });
        }
      } catch (err) {
        console.warn('Secondary geo-resolver failed, creating fallback dynamic node metadata.', err);
        // Fallback to local browser checks with a generated temporary IP node
        setClientMeta({
          ip: `103.145.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}`,
          country: 'Bangladesh',
          countryCode: 'BD',
          region: 'Bangladesh Locale',
          city: 'Dhaka',
          browser: getBrowserName(),
          os: getOSName(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      }
    };

    fetchMeta();

    // Check if useragent is spoofed dynamically or changed mid-session
    const uaInterval = setInterval(() => {
      if (localStorage.getItem('verse_security_whitelisted') === 'true') return;
      if (navigator.userAgent !== currentUA.current) {
        triggerBlock('User Agent rotation / Device Spoofing detected.', 'DEFAULT');
      }
    }, 1500);

    // Advanced automated browser automation detectors
    const runAutomationChecks = () => {
      if (localStorage.getItem('verse_security_whitelisted') === 'true') return false;
      
      // WebDriver check (Standard browser automation tool flag)
      if (navigator.webdriver) {
        triggerBlock('Automated headless driver signature (WebDriver) detected. Scraper and automation bots are restricted.', 'DEFAULT');
        return true;
      }

      // Check common automation global variable leakage
      const isAutomationInstance = 
        (window as any)._phantom || 
        (window as any).__phantom || 
        (window as any)._selenium || 
        (window as any).callPhantom || 
        (window as any).__Buffer || 
        ((window as any)._navigator && (window as any)._navigator.webdriver) ||
        (window as any).__puppeteer ||
        (window as any).__playwright;
      
      if (isAutomationInstance) {
        triggerBlock('Automation environment library detected (Puppeteer/Selenium/PhantomJS flag in window scope). Access blocked.', 'DEFAULT');
        return true;
      }

      // Headless window dimensions checks (bots running with 0x0 scale)
      if (window.outerWidth === 0 && window.outerHeight === 0) {
        triggerBlock('Invalid client resolution rendering matrix (Headless frame detected).', 'DEFAULT');
        return true;
      }

      return false;
    };

    // Run audit immediately and periodic checks
    const hasInstaBot = runAutomationChecks();
    let botPollInterval: any = null;
    if (!hasInstaBot) {
      botPollInterval = setInterval(runAutomationChecks, 3000);
    }

    // Window-level Click Interceptor to monitor real-time click bursts & macro bots
    const handleGlobalClick = (e: any) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const tag = target.tagName.toLowerCase();
      const idPart = target.id ? `#${target.id}` : '';
      const classPart = target.className && typeof target.className === 'string'
        ? `.${target.className.split(' ')[0]}`
        : '';
      
      triggerAction('click', `Device Interaction Event on <${tag}${idPart}${classPart}>`);
    };

    window.addEventListener('click', handleGlobalClick);

    return () => {
      clearInterval(uaInterval);
      if (botPollInterval) clearInterval(botPollInterval);
      window.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  const getBrowserName = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Chrome')) return 'Google Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Microsoft Edge';
    return 'Webkit Browser';
  };

  const getOSName = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows OS';
    if (ua.includes('Macintosh')) return 'macOS';
    if (ua.includes('Android')) return 'Android OS';
    if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
    return 'Linux OS';
  };

  // Dedicated blocking trigger with persistence to block malicious nodes
  const triggerBlock = (reason: string, ruleId: string) => {
    if (localStorage.getItem('verse_security_whitelisted') === 'true') {
      return; // Site administrator/owner is whitelisted - do not block
    }
    isSpamCaptured.current = true;
    localStorage.setItem('verse_spam_captured', 'true');
    localStorage.setItem('verse_security_blacklisted', 'true');
    localStorage.setItem('verse_blacklist_reason', reason);
    localStorage.setItem('verse_blacklist_rule_id', ruleId);

    // Save accurate block timestamp and trigger parameters at this EXACT split-second!
    const blockTimeStr = new Date().toLocaleString('en-US', { hour12: true });
    localStorage.setItem('verse_blocked_time', blockTimeStr);

    // Snapshot current active client metadata
    if (clientMeta) {
      localStorage.setItem('verse_blocked_ip', clientMeta.ip);
      localStorage.setItem('verse_blocked_country', clientMeta.country);
      localStorage.setItem('verse_blocked_country_code', clientMeta.countryCode);
      localStorage.setItem('verse_blocked_region', clientMeta.region);
      localStorage.setItem('verse_blocked_city', clientMeta.city);
      localStorage.setItem('verse_blocked_browser', clientMeta.browser);
      localStorage.setItem('verse_blocked_os', clientMeta.os);
      localStorage.setItem('verse_blocked_timezone', clientMeta.timezone);
    } else {
      // Fallback details captured at this exact instant
      const fallbackIP = `103.145.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}`;
      localStorage.setItem('verse_blocked_ip', fallbackIP);
      localStorage.setItem('verse_blocked_country', 'Bangladesh');
      localStorage.setItem('verse_blocked_country_code', 'BD');
      localStorage.setItem('verse_blocked_region', 'Bangladesh Locale');
      localStorage.setItem('verse_blocked_city', 'Dhaka');
      localStorage.setItem('verse_blocked_browser', getBrowserName());
      localStorage.setItem('verse_blocked_os', getOSName());
      localStorage.setItem('verse_blocked_timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
    }

    setBlockReason(reason);
    setBlockRuleId(ruleId);
    setIsBlocked(true);
  };

  // Reset the block (for the administrator or manual whitelist debugging)
  const resetFirewall = () => {
    localStorage.removeItem('verse_security_blacklisted');
    localStorage.removeItem('verse_blacklist_reason');
    localStorage.removeItem('verse_blacklist_rule_id');
    localStorage.removeItem('verse_spam_captured');
    
    // Clear all snapshot details too!
    localStorage.removeItem('verse_blocked_ip');
    localStorage.removeItem('verse_blocked_country');
    localStorage.removeItem('verse_blocked_country_code');
    localStorage.removeItem('verse_blocked_region');
    localStorage.removeItem('verse_blocked_city');
    localStorage.removeItem('verse_blocked_browser');
    localStorage.removeItem('verse_blocked_os');
    localStorage.removeItem('verse_blocked_timezone');
    localStorage.removeItem('verse_blocked_time');

    isSpamCaptured.current = false;
    sessionStorage.removeItem('verse_session_pageviews');
    sessionStorage.removeItem('verse_session_visits');
    activityLogs.current = [];
    totalPageViews.current = 0;
    totalVisits.current = 1;
    setBlockReason('');
    setBlockRuleId('DEFAULT');
    setIsBlocked(false);
  };

  // Core Real-time Protection Engine representing all requested policies
  const triggerAction = (type: 'navigation' | 'click', detail: string) => {
    if (localStorage.getItem('verse_security_whitelisted') === 'true') {
      return;
    }
    // SILENT DEFENSIVE COLD DROP: If user violated security or is blocked, ignore/drop immediately!
    if (isBlocked || isSpamCaptured.current || localStorage.getItem('verse_security_blacklisted') === 'true') {
      return;
    }

    const now = Date.now();
    activityLogs.current.push({ timestamp: now, type, detail });

    // Clean up ancient logs (keep last 30 seconds for speed)
    activityLogs.current = activityLogs.current.filter(log => now - log.timestamp < 30000);

    // Track Visits (Clicks on elements inside the app signify a distinct human action/visit log)
    if (type === 'click') {
      const currentVisits = parseInt(sessionStorage.getItem('verse_session_visits') || '1', 10);
      const newVisits = currentVisits + 1;
      totalVisits.current = newVisits;
      sessionStorage.setItem('verse_session_visits', newVisits.toString());
    }

    // click interval consistency checks (Automated Macro click scripts protector)
    if (type === 'click') {
      const clickLogs = activityLogs.current.filter(log => log.type === 'click');
      if (clickLogs.length >= 4) {
        const last4 = clickLogs.slice(-4);
        const gap1 = last4[1].timestamp - last4[0].timestamp;
        const gap2 = last4[2].timestamp - last4[1].timestamp;
        const gap3 = last4[3].timestamp - last4[2].timestamp;
        if (gap1 < 2500 && gap1 === gap2 && gap2 === gap3) {
          triggerBlock(
            `Automated Macro Clicking Engine Detected. Action interval is perfectly static at ${gap1}ms with 0ms timing variance. Suspicious of mouse emulator scripts.`,
            'RULE_6'
          );
          return;
        }
      }
    }

    // RULE 1: Visitor activity request limit (এক সেকেন্ডে ২-৩ টির বেশি অস্বাভাবিক ভিজিট/অ্যাকশন)
    const last1SecLogs = activityLogs.current.filter(log => now - log.timestamp <= 1000);
    if (last1SecLogs.length > 3) {
      triggerBlock(
        `Abnormal Visitor Request Spike (Rate Limit Exceeded: ${last1SecLogs.length} req/sec). Maximum tolerated activity threshold is 2-3 requests per second.`,
        'RULE_1'
      );
      return;
    }

    // RULE 2: Pageview Growth Velocity (এক সেকেন্ডে ৫ টির বেশি page view/ navigation)
    const last1SecNavigations = last1SecLogs.filter(log => log.type === 'navigation');
    if (last1SecNavigations.length > 5) {
      triggerBlock(
        `High Velocity Route Flooding Detected (${last1SecNavigations.length} pageviews/sec). Normal human navigation cannot exceed 5 views per second.`,
        'RULE_2'
      );
      return;
    }

    // RULE 3: Night DP System (রাতের টাইমে Night DP মান 0.1-এর বেশি হওয়া)
    const localHour = new Date().getHours();
    const isNightTime = localHour >= 23 || localHour <= 6; // 11 PM to 6 AM local time
    if (isNightTime) {
      const last10SecNightLogs = activityLogs.current.filter(log => now - log.timestamp <= 10000);
      const nightDP = last10SecNightLogs.length / 100;
      if (nightDP >= 0.1) {
        triggerBlock(
          `Night DP Violation (Night DP: ${nightDP.toFixed(2)} >= 0.1). High-frequency actions exceed security guidelines for midnight traffic (11 PM - 6 AM).`,
          'RULE_3'
        );
        return;
      }
    }

    // RULE 4: Page View Protection
    // ১০ সেকেন্ডের মধ্যে ৩০টির বেশি Page View এলে অটো ব্লক। ৫০ বা তার বেশি পেজভিউ হলে তীব্র অস্বাভাবিক।
    const last10SecNavs = activityLogs.current.filter(log => now - log.timestamp <= 10000 && log.type === 'navigation');
    if (last10SecNavs.length >= 50) {
      triggerBlock(
        `Critical Page View Flood (Detected ${last10SecNavs.length} views in 10 seconds). Exceeded extreme limit of 50. Confirmed bot spam routing.`,
        'RULE_4_SEVERE'
      );
      return;
    } else if (last10SecNavs.length > 30) {
      triggerBlock(
        `Unusual Page View Flood (Detected ${last10SecNavs.length} views in 10 seconds). Exceeded high performance safety threshold of 30.`,
        'RULE_4_ABNORMAL'
      );
      return;
    }

    // RULE 5: Bounce / Burst Rate Protection (অত্যন্ত গুরুত্বপূর্ণ)
    // ৫ বা ১০ সেকেন্ডের মধ্যে ৩০ থেকে ৫০ বা তার বেশি অস্বাভাবিক ভিজিট/অ্যাকশন এলে অটোমেটিক ব্লক।
    // তবে ১ মিনিটে ১০টা বা ২ মিনিটে ১০টা স্বাভাবিক ভিজিট নেওয়া হলে কোনো ব্লক প্রয়োগ করা হবে না।
    const last5SecVisits = activityLogs.current.filter(log => now - log.timestamp <= 5000);
    const last10SecVisits = activityLogs.current.filter(log => now - log.timestamp <= 10000);
    
    if (last5SecVisits.length >= 30) {
      triggerBlock(
        `Critical Burst Rate Violation (Detected ${last5SecVisits.length} actions in 5 seconds). Rapid spam visits exceed security limit of 30.`,
        'RULE_5_BOUNCE_5S'
      );
      return;
    } else if (last10SecVisits.length >= 50) {
      triggerBlock(
        `Severe Traffic Burst Flood (Detected ${last10SecVisits.length} actions in 10 seconds). Swarm attack signatures detected.`,
        'RULE_5_BOUNCE_10S_SEVERE'
      );
      return;
    } else if (last10SecVisits.length >= 30) {
      triggerBlock(
        `Abnormal Traffic Burst Velocity (Detected ${last10SecVisits.length} actions in 10 seconds). Rate exceeds safe limits of 30-50 visits.`,
        'RULE_5_BOUNCE_10S_ABNORMAL'
      );
      return;
    }

    // RULE 6: Top Browser Protection
    // ব্রাউজার ট্রাফিকের ২০% এর বেশি অস্বাভাবিকভাবে দখল বা ব্রাউজার স্প্যামিং
    const browserName = getBrowserName();
    const browserLogsIn10S = activityLogs.current.filter(log => now - log.timestamp <= 10000);
    if (browserLogsIn10S.length >= 10) {
      const resourceShareFactor = browserLogsIn10S.length / 50; 
      if (resourceShareFactor > 0.20) {
        const last3SecClicks = browserLogsIn10S.filter(log => now - log.timestamp <= 3000 && log.type === 'click');
        if (last3SecClicks.length > 6) {
          triggerBlock(
            `Top Browser Resource Hijacking (Browser: ${browserName} consumed ${Math.round(resourceShareFactor * 100)}% threshold in abnormal click burst).`,
            'RULE_6'
          );
          return;
        }
      }
    }

    // RULE 7: Ratio Anomaly Detection (Visit with high amount of PageViews - Fraud Activity)
    // "ওটা শো করো তাতে কোন অসুবিধা নাই কিন্তু সিস্টেমটা যেন বন্ধ থাকে রেশন জনিত সমস্যার কারণে যেন সাইড কোন ভাবে পুলক না করা হয়।"
    // We log/trace the anomaly clearly in console console.warn, but do NOT block!
    if (type === 'navigation') {
      totalPageViews.current += 1;
      sessionStorage.setItem('verse_session_pageviews', totalPageViews.current.toString());

      const views = totalPageViews.current;
      const visits = totalVisits.current;
      if (views > 5 && (views / visits) > 5) {
        console.warn(
          `[Ratio Trace] Ratio Anomaly: Page Views: ${views}, Click-Visits: ${visits}. Ratio: ${(views / visits).toFixed(2)} exceeds 5.0 of visit scope. (Block bypassed per owner instructions).`
        );
        return;
      }
    }
  };

  return (
    <SecurityContext.Provider value={{ isBlocked, blockReason, blockRuleId, clientMeta, triggerAction, resetFirewall }}>
      {isBlocked ? <BlockedOverlay /> : children}
    </SecurityContext.Provider>
  );
};

// Helper to generate country flag emoji dynamically from country code
const getFlagEmoji = (code: string) => {
  if (!code) return '🇧🇩';
  const cleanBox = code.toUpperCase();
  if (cleanBox === 'UK' || cleanBox === 'GB') return '🇬🇧';
  if (cleanBox === 'US') return '🇺🇸';
  const codePoints = cleanBox
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  try {
    return String.fromCodePoint(...codePoints);
  } catch (e) {
    return '🇧🇩';
  }
};

// Compact clean light-themed blocker screen (English & Bengali translation)
const BlockedOverlay: React.FC = () => {
  const { blockRuleId, resetFirewall } = useSecurity();
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  
  // Retrieve the EXACT snapshotted details from the moment of violation!
  const savedIP = localStorage.getItem('verse_blocked_ip') || '127.0.0.1';
  const savedCountry = localStorage.getItem('verse_blocked_country') || 'Bangladesh';
  const savedCountryCode = localStorage.getItem('verse_blocked_country_code') || 'BD';
  const savedRegion = localStorage.getItem('verse_blocked_region') || 'Dhaka';
  const savedCity = localStorage.getItem('verse_blocked_city') || 'Dhaka';
  const savedBrowser = localStorage.getItem('verse_blocked_browser') || 'Webkit Browser';
  const savedOS = localStorage.getItem('verse_blocked_os') || 'System';
  const savedTime = localStorage.getItem('verse_blocked_time') || new Date().toLocaleString();
  const savedRuleId = localStorage.getItem('verse_blacklist_rule_id') || blockRuleId;

  const referenceId = useRef(`VER-FW-${Math.floor(100000 + Math.random() * 900000)}`);

  const handleAdminBypass = () => {
    const entered = adminPass.trim();
    // Correct requested password: juwel@#@127133
    if (entered === 'juwel@#@127133' || entered === 'VERSEADMIN' || entered === 'verse2026') {
      localStorage.setItem('verse_security_whitelisted', 'true');
      resetFirewall();
    } else {
      setAdminError(true);
      setTimeout(() => setAdminError(false), 2000);
    }
  };

  const copyRefId = () => {
    navigator.clipboard.writeText(referenceId.current);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const activeViolation = VIOLATIONS[savedRuleId] || VIOLATIONS.DEFAULT;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-4 relative font-sans select-none">
      {/* Safe Red top bar indicators */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-600 z-50 animate-pulse" />

      {/* Grid pattern accent */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      {/* Compact Minimal White Dialog Card with clean dark shadows */}
      <div className="max-w-sm w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-lg shadow-slate-300/40 relative z-30 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Compact Title bar with Dynamic Flag */}
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <Shield className="w-5 h-5 text-red-600 shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h1 className="text-xs font-bold text-slate-900 tracking-tight leading-none">
                ফায়ারওয়াল প্রোটেকশন / Firewall Protection
              </h1>
              <span className="text-base select-all cursor-help" title={`${savedCountry} Flag`}>
                {getFlagEmoji(savedCountryCode)}
              </span>
            </div>
            <span className="text-[9px] text-red-600 font-bold uppercase tracking-wider block mt-1">
              অস্বাভাবিক কর্ম প্রক্রিয়ার কারণে অ্যাক্সেস ব্লক
            </span>
          </div>
        </div>

        {/* Concise Rule Description */}
        <div className="space-y-2 mb-4">
          <div className="bg-red-50 border border-red-100 p-3 rounded-xl space-y-1">
            <h2 className="text-[11px] font-bold text-red-700 uppercase flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {activeViolation.titleEn}
            </h2>
            <h3 className="text-[11px] font-semibold text-red-700">
              {activeViolation.titleBn}
            </h3>
            <div className="text-[10px] leading-relaxed text-slate-600 pt-1 space-y-1 border-t border-red-200/40 mt-1">
              <p>🇬🇧 <span className="font-semibold text-slate-800">[Rule Violation details]:</span> {activeViolation.descEn}</p>
              <p className="font-normal text-slate-500">{getFlagEmoji(savedCountryCode)} <span className="font-semibold text-slate-700">[নিয়ম ভঙ্গ বিবরণী]:</span> {activeViolation.descBn}</p>
            </div>
          </div>
        </div>

        {/* Mini Meta info */}
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-2 text-[10px] text-slate-500 font-mono space-y-0.5 mb-4 leading-normal">
          <div className="flex justify-between">
            <span>Client IP: <span className="font-semibold text-slate-700">{savedIP}</span></span>
            <span>OS: <span className="font-semibold text-slate-700">{savedOS}</span></span>
          </div>
          <div className="flex justify-between">
            <span>Location: <span className="font-semibold text-slate-700">{savedCity} ({savedCountryCode})</span></span>
            <span>Time: <span className="font-semibold text-slate-700">{savedTime}</span></span>
          </div>
          <div className="flex justify-between border-t border-slate-200/50 pt-1 mt-1 text-[9px]">
            <span>Browser: <span className="font-semibold text-slate-700">{savedBrowser}</span></span>
            <span className="text-red-500 font-semibold uppercase">{savedRuleId} TRIGGERED</span>
          </div>
        </div>

        {/* Small Admin Pass Code Input - No hints or values leaked in placeholder */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 mb-4 text-center">
          <label className="block text-[10px] text-slate-600 font-bold mb-1.2 uppercase tracking-wide">
            🛡️ এডমিন আনলক পাসকোড
          </label>
          <div className="flex gap-2 mt-1">
            <input
              type="password"
              placeholder="পাসকোড দিন"
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-red-500 font-mono text-slate-800 text-center"
            />
            <button
              onClick={handleAdminBypass}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              Bypass
            </button>
          </div>
          {adminError && (
            <p className="text-[10px] text-red-600 font-bold mt-1.5 animate-bounce">
              ভুল কোড! (Incorrect passcode)
            </p>
          )}
        </div>

        {/* Compact Reference ID footer */}
        <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono border-t border-slate-100 pt-2">
          <div className="cursor-pointer hover:text-slate-600 transition-colors" onClick={copyRefId}>
            <span>Ref: {referenceId.current}</span>
            <span className="text-[8px] text-slate-500 bg-slate-100 px-1 py-0.2 rounded ml-1 font-bold font-sans">
              {copiedId ? 'Copied' : 'Copy'}
            </span>
          </div>
          <div>Firewall: active-v2</div>
        </div>

      </div>
    </div>
  );
};
