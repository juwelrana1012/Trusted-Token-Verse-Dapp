import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { SecurityFirewallProvider } from './components/SecurityFirewall.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SecurityFirewallProvider>
      <App />
    </SecurityFirewallProvider>
  </StrictMode>,
);
