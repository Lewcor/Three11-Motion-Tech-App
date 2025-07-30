import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import './App.css';
import LandingPage from './components/DemoLandingPage';
import GeneratorPage from './components/GeneratorPage';
import ContentCreationPage from './components/ContentCreationPage';
import PremiumPage from './components/PremiumPage';
import VoiceStudio from './components/VoiceStudio';
import TrendsAnalyzer from './components/TrendsAnalyzer';
import ContentRemixEngine from './components/ContentRemixEngine';
import CompetitorAnalysis from './components/CompetitorAnalysis';
import AuthPage from './components/AuthPage';
// PHASE 2: Power User Features
import BatchContentGenerator from './components/BatchContentGenerator';
import ContentScheduler from './components/ContentScheduler';
import TemplateLibrary from './components/TemplateLibrary';
import AdvancedAnalyticsDashboard from './components/AdvancedAnalyticsDashboard';
// PHASE 3: Content Type Expansion
import VideoContentGenerator from './components/VideoContentGenerator';
import PodcastContentGenerator from './components/PodcastContentGenerator';
import EmailMarketingStudio from './components/EmailMarketingStudio';
import BlogPostGenerator from './components/BlogPostGenerator';
import ProductDescriptionGenerator from './components/ProductDescriptionGenerator';
import Navbar from './components/Navbar';
import MobileNavbar from './components/MobileNavbar';
import { useEffect, useState } from 'react';

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          {isMobile ? <MobileNavbar /> : <Navbar />}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/generator" element={<GeneratorPage />} />
            <Route path="/content-creation" element={<ContentCreationPage />} />
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="/voice-studio" element={<VoiceStudio />} />
            <Route path="/trends-analyzer" element={<TrendsAnalyzer />} />
            <Route path="/content-remix" element={<ContentRemixEngine />} />
            <Route path="/competitor-analysis" element={<CompetitorAnalysis />} />
            {/* PHASE 2: Power User Features */}
            <Route path="/batch-generator" element={<BatchContentGenerator />} />
            <Route path="/scheduler" element={<ContentScheduler />} />
            <Route path="/templates" element={<TemplateLibrary />} />
            <Route path="/analytics" element={<AdvancedAnalyticsDashboard />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;