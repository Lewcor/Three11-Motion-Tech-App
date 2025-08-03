import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopNavigation from "./components/TopNavigation";

// Import page components - Update these to match your actual content creation platform
import Homepage from "./components/pages/Homepage";
import CaptionGenerator from "./components/pages/CaptionGenerator";
import VoiceStudio from "./components/pages/VoiceStudio";
import TrendsAnalyzer from "./components/pages/TrendsAnalyzer";
import ContentRemix from "./components/pages/ContentRemix";
import ContentCreation from "./components/pages/ContentCreation";
import Premium from "./components/pages/Premium";
import TeamAccess from "./components/pages/TeamAccess";
import CompetitivePricing from "./components/pages/CompetitivePricing";

// Additional pages for new navigation structure
const ContentStudio = () => (
  <div className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🎬 Content Studio</h1>
        <p className="text-xl text-gray-600 mb-8">Professional content workspace for creators</p>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-500">Advanced content creation tools coming soon...</p>
        </div>
      </div>
    </div>
  </div>
);

const VideoScripts = () => (
  <div className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">📝 Video Scripts</h1>
        <p className="text-xl text-gray-600 mb-8">Complete video script generation with hooks, content, and CTAs</p>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-500">Video script generation tools coming soon...</p>
        </div>
      </div>
    </div>
  </div>
);

const StrategyPlanner = () => (
  <div className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">📊 Strategy Planner</h1>
        <p className="text-xl text-gray-600 mb-8">Comprehensive content strategies with posting schedules</p>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-500">Content strategy planning tools coming soon...</p>
        </div>
      </div>
    </div>
  </div>
);

const TeamCollaboration = () => (
  <div className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🤝 Team Collaboration</h1>
        <p className="text-xl text-gray-600 mb-8">Work together seamlessly on content creation</p>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-500">Team collaboration features coming soon...</p>
        </div>
      </div>
    </div>
  </div>
);

const AnalyticsDashboard = () => (
  <div className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">📈 Analytics Dashboard</h1>
        <p className="text-xl text-gray-600 mb-8">Track content performance across all platforms</p>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-500">Analytics dashboard coming soon...</p>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <TopNavigation />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/generator" element={<CaptionGenerator />} />
          <Route path="/voice-studio" element={<VoiceStudio />} />
          <Route path="/trends-analyzer" element={<TrendsAnalyzer />} />
          <Route path="/content-remix" element={<ContentRemix />} />
          <Route path="/content-creation" element={<ContentCreation />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/team-access" element={<TeamAccess />} />
          <Route path="/competitive-pricing" element={<CompetitivePricing />} />
          
          {/* New navigation pages */}
          <Route path="/content-studio" element={<ContentStudio />} />
          <Route path="/video-scripts" element={<VideoScripts />} />
          <Route path="/strategy-planner" element={<StrategyPlanner />} />
          <Route path="/team-collaboration" element={<TeamCollaboration />} />
          <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;