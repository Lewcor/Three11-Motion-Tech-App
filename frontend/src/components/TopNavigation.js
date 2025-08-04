import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NavigationSidebar from './NavigationSidebar';

const TopNavigation = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-30 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 shadow-lg border-b border-purple-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left: Logo and Brand */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-3">
                <img 
                  src="https://customer-assets.emergentagent.com/job_sidebar-nav-fix/artifacts/891136ci_THREE11%20-%20LOGO.png" 
                  alt="THREE11 MOTION TECH"
                  className="w-12 h-12 object-contain"
                />
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-white">THREE11 MOTION TECH</h1>
                  <p className="text-sm text-purple-100">Revolutionary AI-Powered Content Creation Platform</p>
                </div>
              </Link>
            </div>

            {/* Center: Quick Access (Optional - for important features) */}
            <div className="hidden lg:flex items-center space-x-6">
              <Link 
                to="/generator" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Caption Generator
              </Link>
              <Link 
                to="/voice-studio" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center space-x-1"
              >
                <span>Voice Studio</span>
                <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-800 rounded-full font-bold">BETA</span>
              </Link>
              <Link 
                to="/trends-analyzer" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center space-x-1"
              >
                <span>Trends</span>
                <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full font-bold">LIVE</span>
              </Link>
            </div>

            {/* Right: Menu Button */}
            <div className="flex items-center space-x-4">
              {/* Premium Button */}
              <Link 
                to="/premium"
                className="hidden sm:inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
              >
                <span className="mr-1">⭐</span>
                Premium
              </Link>

              {/* Menu Button */}
              <button
                onClick={toggleSidebar}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200 group"
              >
                <svg 
                  className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>Menu</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Component */}
      <NavigationSidebar isOpen={sidebarOpen} onClose={closeSidebar} />
    </>
  );
};

export default TopNavigation;