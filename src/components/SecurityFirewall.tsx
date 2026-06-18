import React, { createContext, useContext } from 'react';

// Define standard types to match any expected interfaces
export interface ClientMeta {
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
  blockRuleId: string;
  clientMeta: ClientMeta | null;
  triggerAction: (type: 'navigation' | 'click', detail: string) => void;
  resetFirewall: () => void;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    // Graceful fallback to prevent crashes if used outside provider
    return {
      isBlocked: false,
      blockReason: '',
      blockRuleId: 'DEFAULT',
      clientMeta: null,
      triggerAction: () => {},
      resetFirewall: () => {},
    };
  }
  return context;
};

export const SecurityFirewallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isBlocked = false;
  const blockReason = '';
  const blockRuleId = 'DEFAULT';
  const clientMeta: ClientMeta = {
    ip: '127.0.0.1',
    country: 'Bangladesh',
    countryCode: 'BD',
    region: 'Dhaka',
    city: 'Dhaka',
    browser: 'Secure Browser',
    os: 'Sovereign OS',
    timezone: 'Asia/Dhaka'
  };

  const triggerAction = (type: 'navigation' | 'click', detail: string) => {
    // No-op: Completely disable bot/visitor throttling, flooding checks, and logs.
  };

  const resetFirewall = () => {
    // No-op: Firewalls are permanently disabled
  };

  return (
    <SecurityContext.Provider value={{ isBlocked, blockReason, blockRuleId, clientMeta, triggerAction, resetFirewall }}>
      {children}
    </SecurityContext.Provider>
  );
};
