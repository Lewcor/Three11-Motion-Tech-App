import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import './App.css';
import LandingPage from './components/LandingPage';
import GeneratorPage from './components/GeneratorPage';
import ContentCreationPage from './components/ContentCreationPage';
import PremiumPage from './components/PremiumPage';
import VoiceStudio from './components/VoiceStudio';
import TrendsAnalyzer from './components/TrendsAnalyzer';
import ContentRemixEngine from './components/ContentRemixEngine';
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
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;