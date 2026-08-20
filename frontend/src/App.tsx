import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { TopNav } from './components/layout/TopNav';
import { Footer } from './components/layout/Footer';
import { CommandCenter } from './pages/CommandCenter';
import { ProjectInput } from './pages/ProjectInput';
import { PredictionsHub } from './pages/PredictionsHub';
import { SpaceOptimizationPage } from './pages/SpaceOptimizationPage';
import { AlertCenter } from './pages/AlertCenter';
import { AIInsightsPage } from './pages/AIInsightsPage';
import { ReportsPage } from './pages/ReportsPage';
import { ModelRegistryPage } from './pages/ModelRegistryPage';
import { ModelDetailPage } from './pages/ModelDetailPage';
import { TheBrainsPage } from './pages/TheBrainsPage';
import { ConstructionAIPage } from './pages/ConstructionAIPage';
import { HelpPage } from './pages/HelpPage';
import { FAQPage } from './pages/FAQPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { DocsPage } from './pages/DocsPage';
import { SecurityPage } from './pages/SecurityPage';
import { NotFoundPage } from './pages/NotFoundPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    // Update document title for SEO
    const titleMap: Record<string, string> = {
      '/': 'ConArk Systems | AI-Driven Construction Intelligence',
      '/construction-ai': 'ConArk Intelligence | ConArk Systems',
      '/input': 'Project Input Telemetry | ConArk Systems',
      '/predictions': 'Predictions Hub | ConArk Systems',
      '/space-optimization': 'Space Optimization | ConArk Systems',
      '/alerts': 'Safety & Resource Alerts | ConArk Systems',
      '/ai-insights': 'AI Insights | ConArk Systems',
      '/reports': 'Executive Reports | ConArk Systems',
      '/models': 'Model Registry | ConArk Systems',
      '/brains': 'The Brains | ConArk Systems',
      '/team': 'The Brains | ConArk Systems',
      '/help': 'Help & Support | ConArk Systems',
      '/faq': 'FAQ | ConArk Systems',
      '/privacy': 'Privacy Policy | ConArk Systems',
      '/terms': 'Terms of Service | ConArk Systems',
      '/disclaimer': 'Disclaimer & Disclosure | ConArk Systems',
      '/docs': 'Documentation | ConArk Systems',
      '/security': 'Security | ConArk Systems'
    };

    if (titleMap[pathname]) {
      document.title = titleMap[pathname];
    } else if (pathname.startsWith('/model/')) {
      document.title = 'Model Detail | ConArk Systems';
    } else {
      document.title = '404 Page Not Found | ConArk Systems';
    }
  }, [pathname]);

  return null;
};

const MainContent: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  // Light blueprint grid is active ONLY on Model / Operational pages, NOT on Home or Legal / Support pages
  const isExcludedPage = path === '/' || path === '/brains' || path === '/team' ||
                         path === '/help' || path === '/faq' || path === '/privacy' ||
                         path === '/terms' || path === '/disclaimer' || path === '/docs' ||
                         path === '/security';
  const showGrid = !isExcludedPage;

  return (
    <main className={showGrid ? 'bg-grid-blueprint' : ''} style={{ flex: 1 }}>
      <Routes>
        <Route path="/" element={<CommandCenter />} />
        <Route path="/construction-ai" element={<ConstructionAIPage />} />
        <Route path="/input" element={<ProjectInput />} />
        <Route path="/predictions" element={<PredictionsHub />} />
        <Route path="/space-optimization" element={<SpaceOptimizationPage />} />
        <Route path="/alerts" element={<AlertCenter />} />
        <Route path="/ai-insights" element={<AIInsightsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/models" element={<ModelRegistryPage />} />
        <Route path="/model/:modelId" element={<ModelDetailPage />} />
        <Route path="/brains" element={<TheBrainsPage />} />
        <Route path="/team" element={<TheBrainsPage />} />

        {/* Footer Support, Legal & Documentation Routes */}
        <Route path="/help" element={<HelpPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/security" element={<SecurityPage />} />

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#EDECE7' }}>
        <TopNav />
        <MainContent />
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
