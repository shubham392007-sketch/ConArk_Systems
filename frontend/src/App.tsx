import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { TopNav } from './components/layout/TopNav';
import { Footer } from './components/layout/Footer';

// Operational & Model Pages
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

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';
import { AuthCallbackPage } from './pages/auth/AuthCallbackPage';

// Authenticated User Workspace Pages
import { PredictionHistoryPage } from './pages/PredictionHistoryPage';
import { PredictionDetailPage } from './pages/PredictionDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

// Legal, Support & Info Pages
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

    // Update document title
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
      '/login': 'Sign In | ConArk Systems',
      '/signup': 'Create Account | ConArk Systems',
      '/forgot-password': 'Reset Password | ConArk Systems',
      '/history': 'Prediction History | ConArk Systems',
      '/projects': 'Project Workspaces | ConArk Systems',
      '/profile': 'Engineer Profile | ConArk Systems',
      '/settings': 'Account Settings | ConArk Systems',
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
    } else if (pathname.startsWith('/predictions/')) {
      document.title = 'Prediction Detail | ConArk Systems';
    } else {
      document.title = 'ConArk Systems | AI Construction Intelligence';
    }
  }, [pathname]);

  return null;
};

const MainContent: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  // Light blueprint grid is active ONLY on Model / Operational pages, NOT on Home or Auth or Legal pages
  const isExcludedPage = path === '/' || path === '/brains' || path === '/team' ||
                         path === '/login' || path === '/signup' || path === '/forgot-password' ||
                         path === '/reset-password' || path === '/verify-email' || path === '/auth/callback' ||
                         path === '/help' || path === '/faq' || path === '/privacy' ||
                         path === '/terms' || path === '/disclaimer' || path === '/docs' ||
                         path === '/security' || path === '/profile' || path === '/settings';
  const showGrid = !isExcludedPage;

  return (
    <main className={showGrid ? 'bg-grid-blueprint' : ''} style={{ flex: 1 }}>
      <Routes>
        {/* Public Landing & Overview Routes */}
        <Route path="/" element={<CommandCenter />} />
        <Route path="/brains" element={<TheBrainsPage />} />
        <Route path="/team" element={<TheBrainsPage />} />

        {/* Protected ConArk AI & Intelligence Models Routes (Requires Sign In) */}
        <Route path="/construction-ai" element={<ProtectedRoute><ConstructionAIPage /></ProtectedRoute>} />
        <Route path="/models" element={<ProtectedRoute><ModelRegistryPage /></ProtectedRoute>} />
        <Route path="/model/:modelId" element={<ProtectedRoute><ModelDetailPage /></ProtectedRoute>} />
        <Route path="/input" element={<ProtectedRoute><ProjectInput /></ProtectedRoute>} />
        <Route path="/predictions" element={<ProtectedRoute><PredictionsHub /></ProtectedRoute>} />
        <Route path="/space-optimization" element={<ProtectedRoute><SpaceOptimizationPage /></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute><AlertCenter /></ProtectedRoute>} />
        <Route path="/ai-insights" element={<ProtectedRoute><AIInsightsPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />

        {/* Supabase Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Protected User Workspace Routes */}
        <Route path="/history" element={<ProtectedRoute><PredictionHistoryPage /></ProtectedRoute>} />
        <Route path="/predictions/:id" element={<ProtectedRoute><PredictionDetailPage /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

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

const ConditionalFooter: React.FC = () => {
  const { pathname } = useLocation();
  // Do not show footer on ConArk AI Page
  if (pathname === '/construction-ai') {
    return null;
  }
  return <Footer />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#EDECE7' }}>
          <TopNav />
          <MainContent />
          <ConditionalFooter />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
