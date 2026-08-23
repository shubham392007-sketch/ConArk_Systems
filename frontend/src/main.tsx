import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Automatic recovery handler for stale JS asset 404 errors after deployments
window.addEventListener('error', (event) => {
  const target = event.target as HTMLElement | null;
  if (target && (target.tagName === 'SCRIPT' || target.tagName === 'LINK')) {
    const reloaded = sessionStorage.getItem('conark_asset_reload');
    if (!reloaded) {
      sessionStorage.setItem('conark_asset_reload', 'true');
      window.location.reload();
    }
  }
}, true);

window.addEventListener('unhandledrejection', (event) => {
  const reason = String(event.reason || '');
  if (reason.includes('Failed to fetch') || reason.includes('Importing a module script failed') || reason.includes('dynamically imported module')) {
    const reloaded = sessionStorage.getItem('conark_asset_reload');
    if (!reloaded) {
      sessionStorage.setItem('conark_asset_reload', 'true');
      window.location.reload();
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
