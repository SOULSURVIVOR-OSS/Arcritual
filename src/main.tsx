import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Handle OAuth callback popup if opened directly
if (typeof window !== 'undefined' && window.location.pathname.startsWith('/auth/')) {
  if (window.opener) {
    window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', provider: 'strava' }, '*');
    window.close();
  } else {
    window.location.href = '/';
  }
} else {
  createRoot(document.getElementById('root')!).render(<App />);
}
