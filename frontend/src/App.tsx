import React from 'react';
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

const MainContent: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  // Light blueprint grid is active ONLY on Model / Operational pages, NOT on Home ('/') or Developers ('/brains', '/team')
  const isExcludedPage = path === '/' || path === '/brains' || path === '/team';
  const showGrid = !isExcludedPage;

  return (
    <main className={showGrid ? 'bg-grid-blueprint' : ''} style={{ flex: 1 }}>
      <Routes>
        <Route path="/" element={<CommandCenter />} />
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
      </Routes>
    </main>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#EDECE7' }}>
        <TopNav />
        <MainContent />
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
