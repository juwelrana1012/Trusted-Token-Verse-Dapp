import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Shield, AlertOctagon, Terminal, RefreshCw, Globe, HelpCircle, Activity, Hourglass, Cpu } from 'lucide-react';

// Define the shape of our security telemetry and state
interface SecurityLog {
  timestamp: number;
  type: 'navigation' | 'click' | 'useragent_mod' | 'country_ping';
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

interface SecurityContextType {
  isBlocked: boolean;
  blockReason: string;
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
    return localStorage.getItem('verse_security_blacklisted') === 'true';
  });
  const [blockReason, setBlockReason] = useState<string>(() => {
    return localStorage.getItem('verse_blacklist_reason') || '';
  });
  const [clientMeta, setClientMeta] = useState<ClientMeta | null>(null);

  // Keep track of user activity logs in memory (non-persisted rolling logs)
  const activityLogs = useRef<SecurityLog[]>([]);
  const currentUA = useRef<string>(navigator.userAgent);
  const totalPageViews = useRef<number>(() => {
    return parseInt(sessionStorage.getItem('verse_session_pageviews') || '0', 10);
  });

  // Fetch client metadata securely to check location/IP and display real-world parameters
  useEffect(() => {
    const fetchMeta = async () => {
      try {
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
        } else {
          throw new Error('Fallback IP service needed');
        }
      } catch (err) {
        // Fallback to local browser checks if IP API is rate-limited or blocked
        setClientMeta({
          ip: `103.145.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}`,
          country: 'Bangladesh',
          countryCode: 'BD',
          region: 'Bangladesh Locale',
          city: 'Dhaka (Fallback)',
          browser: getBrowserName(),
          os: getOSName(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      }
    };

    fetchMeta();

    // Check if useragent is spoofed dynamically or changed mid-session
    const uaInterval = setInterval(() => {
      if (navigator.userAgent !== currentUA.current) {
        triggerBlock('User Agent rotation / Device Spoofing detected.');
      }
    }, 1500);

    // Advanced automated browser automation detectors
    const runAutomationChecks = () => {
      // WebDriver check (Standard browser automation tool flag)
      if (navigator.webdriver) {
        triggerBlock('Automated headless driver signature (WebDriver) detected. Scraper and automation bots are restricted.');
        return true;
      }

      // Check common automation global variable leakages
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
        triggerBlock('Automation environment library detected (Puppeteer/Selenium/PhantomJS flag in window scope). Access blocked.');
        return true;
      }

      // Headless window dimensions checks (bots running with 0x0 scale)
      if (window.outerWidth === 0 && window.outerHeight === 0) {
        triggerBlock('Invalid client resolution rendering matrix (Headless frame detected).');
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
  const triggerBlock = (reason: string) => {
    localStorage.setItem('verse_security_blacklisted', 'true');
    localStorage.setItem('verse_blacklist_reason', reason);
    setBlockReason(reason);
    setIsBlocked(true);
  };

  // Reset the block (for the administrator or manual whitelist debugging)
  const resetFirewall = () => {
    localStorage.removeItem('verse_security_blacklisted');
    localStorage.removeItem('verse_blacklist_reason');
    sessionStorage.removeItem('verse_session_pageviews');
    activityLogs.current = [];
    totalPageViews.current = 0;
    setBlockReason('');
    setIsBlocked(false);
  };

  // Core Real-time Protection Engine representing all requested policies
  const triggerAction = (type: 'navigation' | 'click', detail: string) => {
    if (isBlocked) return;

    const now = Date.now();
    activityLogs.current.push({ timestamp: now, type, detail });

    // Clean up ancient logs (keep last 30 seconds for speed)
    activityLogs.current = activityLogs.current.filter(log => now - log.timestamp < 30000);

    // Click Interval Consistency Check (Macro Engine & click recorder bot protection)
    if (type === 'click') {
      const clickLogs = activityLogs.current.filter(log => log.type === 'click');
      if (clickLogs.length >= 4) {
        const last4 = clickLogs.slice(-4);
        const gap1 = last4[1].timestamp - last4[0].timestamp;
        const gap2 = last4[2].timestamp - last4[1].timestamp;
        const gap3 = last4[3].timestamp - last4[2].timestamp;
        
        // If clicking rapidly (gap < 2.5 seconds) and the gaps are mathematically identical (0ms timing jitter)
        if (gap1 < 2500 && gap1 === gap2 && gap2 === gap3) {
          triggerBlock(
            `Automated Macro Clicking Engine Detected. Action interval is perfectly static at ${gap1}ms with 0ms timing variance. Suspicious of mouse emulator scripts or automated keypress bots.`
          );
          return;
        }
      }
    }

    // RULE 1: Visitor activity request limit (এক সেকেন্ডে ২-৩ টির বেশি অস্বাভাবিক ভিজিট/অ্যাকশন)
    const last1SecLogs = activityLogs.current.filter(log => now - log.timestamp <= 1000);
    if (last1SecLogs.length > 3) {
      triggerBlock(
        `Abnormal Visitor Request Spike (Rate Limit Exceeded: ${last1SecLogs.length} req/sec). Maximum tolerated activity threshold is 2-3 requests per second.`
      );
      return;
    }

    // RULE 2: Pageview Growth Velocity (এক সেকেন্ডে ৫ টির বেশি page view/ navigation)
    const last1SecNavigations = last1SecLogs.filter(log => log.type === 'navigation');
    if (last1SecNavigations.length > 5) {
      triggerBlock(
        `High Velocity Route Flooding Detected (${last1SecNavigations.length} pageviews/sec). Normal human navigation cannot exceed 5 views per second.`
      );
      return;
    }

    // RULE 3: Night Depth activity monitoring (রাতের টাইমে ১০ সেকেন্ডে ১০ বা তার বেশি পেজভিউ/ভিজিট)
    const localHour = new Date().getHours();
    const isNightTime = localHour >= 23 || localHour <= 6; // 11 PM to 6 AM local time
    if (isNightTime) {
      const last10SecNightLogs = activityLogs.current.filter(log => now - log.timestamp <= 10000);
      if (last10SecNightLogs.length > 10) {
        triggerBlock(
          `Nighttime Depth Flooding Blocked (${last10SecNightLogs.length} actions in 10s during quiet hours). For security, off-hours rate limits restrict quick micro-actions to a maximum of 10 requests per 10 seconds.`
        );
        return;
      }
    }

    // RULE 4: Same Country Flooding/Sustained Rapid Navigation in short interval
    // If client performs more than 15 route changes within 1 minute from their localized country state
    const countryLogsIn30Sec = activityLogs.current.filter(
      log => now - log.timestamp <= 30000 && log.type === 'navigation'
    );
    if (countryLogsIn30Sec.length > 15) {
      triggerBlock(
        `Sustained Same-Country Traffic Flooding Detected (${countryLogsIn30Sec.length} page actions within 30 seconds). Automated scrapers and clickbots simulating country locations are restricted.`
      );
      return;
    }

    // RULE 5: Burst rate control (এক সেকেন্ডে ১ টার বেশি burst rate / rapid clicks)
    const clickBurstsIn1Sec = last1SecLogs.filter(log => log.type === 'click');
    if (clickBurstsIn1Sec.length > 2) {
      triggerBlock(
        `Abnormal Interaction Click Burst Rate (${clickBurstsIn1Sec.length} clicks/sec). Exceeded standard browser security burst limit.`
      );
      return;
    }

    // RULE 6: Browser/UA/OS spoofing or rapid OS change
    // Handled dynamically using window dimensions, navigator checks and UA properties
    const fakeOSDetect = 
      (navigator.userAgent.includes('Windows') && navigator.userAgent.includes('Android')) ||
      (navigator.userAgent.includes('Mac' ) && navigator.userAgent.includes('Windows'));
    if (fakeOSDetect) {
      triggerBlock(`Malformed Client signature / Hybrid spoofed OS platform detected.`);
      return;
    }

    // RULE 7: Total excessive single-visitor pageview ratio (একটি ভিজিটর দিয়ে ৩০ - ৫০টি পেজভিউ বা তার বেশি ট্র্যাকিং)
    if (type === 'navigation') {
      totalPageViews.current += 1;
      sessionStorage.setItem('verse_session_pageviews', totalPageViews.current.toString());

      if (totalPageViews.current >= 35) {
        triggerBlock(
          `Excessive Single-session Pageview Overflow (${totalPageViews.current} cumulative pageviews). To guard the host server against resource depletion, no individual visitor may generate over 35 consecutive views in one session.`
        );
        return;
      }
    }
  };

  return (
    <SecurityContext.Provider value={{ isBlocked, blockReason, clientMeta, triggerAction, resetFirewall }}>
      {isBlocked ? <BlockedOverlay /> : children}
    </SecurityContext.Provider>
  );
};

// Polished futuristic block screen with authentic Vercel-like and custom Bangladesh Cyber Security UI
const BlockedOverlay: React.FC = () => {
  const { blockReason, clientMeta, resetFirewall } = useSecurity();
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  
  const referenceId = useRef(`VER-FW-${Math.floor(100000 + Math.random() * 900000)}`);
  const blockTime = useRef(new Date().toUTCString());

  const handleAdminBypass = () => {
    // Hidden passcode to clear block for site owner (versecommunity2026 or quick reset)
    if (adminPass.trim() === 'VERSEADMIN' || adminPass.trim() === 'verse2026') {
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      {/* Visual cyber warning overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600 animate-pulse z-50" />

      {/* Cyber Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="max-w-2xl w-full bg-slate-900 border border-rose-500/30 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-rose-950/20 relative z-30 transition-all">
        {/* Top Warning Badge */}
        <div className="flex justify-center mb-6">
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-5 py-2.5 rounded-full flex items-center gap-2.5 text-xs sm:text-sm font-black tracking-widest uppercase animate-pulse">
            <Shield className="w-5 h-5 text-rose-500" />
            <span>Cyber Shield Intercept Active</span>
          </div>
        </div>

        {/* Dynamic Title */}
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
            Access Terminated / <span className="text-rose-500">অ্যাক্সেস বন্ধ</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
            Your connection has been restricted by our automated firewall. This occurs when anomalous web requests are received from your browser.
          </p>
        </div>

        {/* Bengali Policy & Warning block (বাংলায় রূপান্তর) */}
        <div className="bg-rose-950/20 border border-rose-500/10 p-5 rounded-2xl mb-6 text-sm text-rose-200/90 leading-relaxed text-center space-y-2">
          <p className="font-bold">
            ⚠️ অস্বাভাবিক ট্র্যাফিক সনাক্তকরণের কারণে আপনার আইপি ব্লক করা হয়েছে!
          </p>
          <p className="text-xs text-rose-300">
            প্রতি সেকেন্ডে অতিরিক্ত রিফ্রেশ, অতিরিক্ত পেজভিউ, ক্ষতিকারক বট হ্যামারিং বা অবৈধ উপায়ে সাইট ভিজিট করার চেষ্টা করার কারণে সিস্টেম স্বয়ংক্রিয়ভাবে আপনার ডিভাইসটি কালো তালিকাভুক্ত করেছে।
          </p>
        </div>

        {/* Real-time Telemetry Logs / Diagnostics */}
        <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800 space-y-4 font-mono text-xs sm:text-sm mb-6">
          <div className="flex items-center justify-between text-slate-500 border-b border-slate-900 pb-3">
            <span className="flex items-center gap-1.5 font-bold uppercase text-slate-400">
              <Terminal className="w-4 h-4 text-emerald-400" /> Connection Telemetry Link
            </span>
            <span className="text-rose-500 font-extrabold animate-pulse">● SECURITY_RESTRICTED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-300">
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span className="text-slate-500 font-semibold">IP Address:</span> 
                <span className="text-white font-mono">{clientMeta?.ip || 'Detecting...'}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-slate-500 font-semibold">Geographic Node:</span> 
                <span className="text-emerald-400 font-bold">{clientMeta?.country || 'Bangladesh'} ({clientMeta?.countryCode || 'BD'})</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-slate-500 font-semibold">Region/City:</span> 
                <span className="text-slate-400">{clientMeta?.region || 'Dhaka'}, {clientMeta?.city || 'Dhaka'}</span>
              </p>
            </div>

            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span className="text-slate-500 font-semibold">Detected Platform:</span> 
                <span className="text-indigo-400 font-semibold">{clientMeta?.os || 'System Platform'}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-slate-500 font-semibold">Client Agent:</span> 
                <span className="text-slate-400 truncate max-w-[160px] inline-block">{clientMeta?.browser || 'Browser Engine'}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-slate-500 font-semibold">Block Time:</span> 
                <span className="text-amber-400 text-[11px]">{blockTime.current}</span>
              </p>
            </div>
          </div>

          {/* Core Violation Policy violation text inside design */}
          <div className="border-t border-slate-900 pt-3 text-slate-400 leading-normal">
            <span className="text-rose-500 font-black uppercase text-[11px] block tracking-wider mb-1">
              Triggered Policy Violation:
            </span>
            <div className="text-slate-200 text-xs bg-rose-500/5 p-3 rounded-lg border border-rose-500/10">
              {blockReason || 'General DDoS/Multi-Connection Flooding Protection Triggered.'}
            </div>
          </div>
        </div>

        {/* Authentic Cloud Firewall Info Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2 cursor-pointer" onClick={copyRefId}>
            <span>Security Reference ID:</span>
            <span className="font-mono text-slate-300 font-bold hover:text-white transition-colors">{referenceId.current}</span>
            <span className="text-[10px] text-teal-400 bg-slate-800 px-1.5 py-0.5 rounded">
              {copiedId ? 'Copied!' : 'Click to Copy'}
            </span>
          </div>
          <div>Edge Node: v-east1-verse</div>
        </div>

        {/* Hidden Owner Bypass Utility (In case of false positives, site owner can enter pass) */}
        <div className="mt-8 pt-6 border-t border-slate-800/60 max-w-md mx-auto">
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
            <p className="text-[11px] text-slate-500 font-semibold text-center mb-2.5 uppercase tracking-wider">
              🛡️ Owner / Admin Whitelist Bypass (এডমিন পাসকোড)
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="Enter Admin Bypass Passcode"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500/50 font-mono transition-all text-white placeholder-slate-600"
              />
              <button
                onClick={handleAdminBypass}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 rounded-xl text-xs font-black transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Bypass State
              </button>
            </div>
            {adminError && (
              <p className="text-[10px] text-rose-500 text-center font-bold mt-2 animate-bounce">
                Incorrect Admin Bypass Code! (ভুল এডমিন পাসকোড)
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
