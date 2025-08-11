import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sparkles, Crown, Zap, Brain, Lightbulb, Mic, TrendingUp, Shuffle, Menu, Target, Calendar, BookOpen, BarChart3, Video, Headphones, Mail, PenTool, Package, TestTube, Telescope, Eye, Users2, UserCog, MessageSquareMore, Share2, Send, Database, Workflow, HelpCircle, Monitor, ChevronDown, ChevronRight, X } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  const navCategories = [
    {
      id: 'core',
      name: 'Core Features',
      icon: Sparkles,
      badge: 'MAIN',
      badgeColor: 'bg-blue-500',
      items: [
        { path: '/generator', name: 'AI Generator', icon: Sparkles, badge: 'CORE' },
        { path: '/content-creation', name: 'Content Suite', icon: Brain, badge: 'NEW' },
        { path: '/voice-studio', name: 'Voice Studio', icon: Mic, badge: 'BETA' },
        { path: '/trends-analyzer', name: 'Trends Analyzer', icon: TrendingUp, badge: 'LIVE' },
        { path: '/content-remix', name: 'Content Remix', icon: Shuffle, badge: 'AI' }
      ]
    },
    {
      id: 'power',
      name: 'Power Features',
      icon: Zap,
      badge: 'PRO',
      badgeColor: 'bg-purple-500',
      items: [
        { path: '/batch-generator', name: 'Batch Generator', icon: Zap, badge: 'POWER' },
        { path: '/scheduler', name: 'Content Scheduler', icon: Calendar, badge: 'PLAN' },
        { path: '/templates', name: 'Template Library', icon: BookOpen, badge: 'PRO' },
        { path: '/analytics', name: 'Advanced Analytics', icon: BarChart3, badge: 'INSIGHTS' }
      ]
    },
    {
      id: 'content',
      name: 'Content Studio',
      icon: Video,
      badge: 'STUDIO',
      badgeColor: 'bg-green-500',
      items: [
        { path: '/ai-video-studio', name: 'AI Video Studio', icon: Sparkles, badge: 'NEW' },
        { path: '/video-content', name: 'Video Content', icon: Video, badge: 'VIDEO' },
        { path: '/podcast-content', name: 'Podcast Content', icon: Headphones, badge: 'AUDIO' },
        { path: '/email-marketing', name: 'Email Marketing', icon: Mail, badge: 'EMAIL' },
        { path: '/blog-generator', name: 'Blog Generator', icon: PenTool, badge: 'BLOG' },
        { path: '/product-descriptions', name: 'Product Descriptions', icon: Package, badge: 'ECOM' }
      ]
    },
    {
      id: 'intelligence',
      name: 'AI Intelligence',
      icon: Brain,
      badge: 'SMART',
      badgeColor: 'bg-cyan-500',
      items: [
        { path: '/performance-tracker', name: 'Performance Tracker', icon: BarChart3, badge: 'TRACK' },
        { path: '/engagement-predictor', name: 'Engagement Predictor', icon: Eye, badge: 'PREDICT' },
        { path: '/ab-testing', name: 'A/B Testing', icon: TestTube, badge: 'TEST' },
        { path: '/competitor-monitor', name: 'Competitor Monitor', icon: Telescope, badge: 'INTEL' },
        { path: '/trend-forecaster', name: 'Trend Forecaster', icon: TrendingUp, badge: 'FORECAST' }
      ]
    },
    {
      id: 'team',
      name: 'Team Hub',
      icon: Users2,
      badge: 'TEAM',
      badgeColor: 'bg-orange-500',
      items: [
        { path: '/team-dashboard', name: 'Team Dashboard', icon: Users2, badge: 'TEAM' },
        { path: '/team-management', name: 'Team Management', icon: UserCog, badge: 'MANAGE' },
        { path: '/role-management', name: 'Role Management', icon: UserCog, badge: 'ROLES' },
        { path: '/collaboration-tools', name: 'Collaboration Tools', icon: MessageSquareMore, badge: 'COLLAB' }
      ]
    },
    {
      id: 'social',
      name: 'Social Automation',
      icon: Share2,
      badge: 'AUTO',
      badgeColor: 'bg-indigo-500',
      items: [
        { path: '/social-dashboard', name: 'Social Dashboard', icon: Share2, badge: 'SOCIAL' },
        { path: '/social-publishing', name: 'Social Publishing', icon: Send, badge: 'PUBLISH' },
        { path: '/automation-workflows', name: 'Automation Workflows', icon: Workflow, badge: 'AUTO' },
        { path: '/crm-integration', name: 'CRM Integration', icon: Database, badge: 'CRM' }
      ]
    }
  ];

  const quickAccess = [
    { path: '/getting-started', name: 'Getting Started Guide', icon: HelpCircle, badge: 'HELP', badgeColor: 'bg-blue-500' },
    { path: '/presentation', name: 'Platform Demo', icon: Monitor, badge: 'DEMO', badgeColor: 'bg-green-500' },
    { path: '/user-guide', name: 'User Manual', icon: BookOpen, badge: 'GUIDE', badgeColor: 'bg-purple-500' },
    { path: '/premium', name: 'Premium Access', icon: Crown, badge: 'Pro', badgeColor: 'bg-yellow-500' }
  ];

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <>
      {/* Top Header - Minimal */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img 
                src="/logo.svg" 
                alt="THREE11 MOTION TECH Logo" 
                className="h-8 w-8 group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                THREE11 MOTION TECH
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:block">
                AI-Powered Social Media Platform
              </span>
            </div>
          </Link>

          {/* Authentication Buttons */}
          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <button 
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  setIsLoggedIn(false);
                  window.location.href = '/';
                }}
                className="hidden md:inline-flex items-center justify-center h-9 px-4 py-2 border border-red-300 bg-white hover:bg-red-50 text-red-700 rounded-md text-sm font-medium transition-colors"
              >
                Log Out
              </button>
            ) : (
              <>
                <Link 
                  to="/auth" 
                  className="hidden md:inline-flex items-center justify-center h-9 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-md text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/auth" 
                  className="hidden md:inline-flex items-center justify-center h-9 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md text-sm font-medium transition-colors hover:from-blue-700 hover:to-purple-700"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center space-x-2"
            >
              <Menu className="h-5 w-5" />
              <span className="hidden sm:block">Menu</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Vertical Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-80 bg-white/98 backdrop-blur-md border-r border-slate-200 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.svg" 
                alt="THREE11 MOTION TECH Logo" 
                className="h-8 w-8"
              />
              <div>
                <h2 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  THREE11 MOTION TECH
                </h2>
                <p className="text-xs text-slate-500">Navigation Menu</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {/* Feature Categories */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-2">
                Feature Categories
              </h3>
              
              {navCategories.map((category) => {
                const CategoryIcon = category.icon;
                const isExpanded = expandedCategory === category.id;
                const hasActiveItem = category.items.some(item => location.pathname === item.path);
                
                return (
                  <div key={category.id} className="space-y-1">
                    {/* Category Header */}
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                        hasActiveItem 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <CategoryIcon className="h-5 w-5" />
                        <span className="font-medium">{category.name}</span>
                        <Badge className={`${category.badgeColor} text-white text-xs`}>
                          {category.badge}
                        </Badge>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>

                    {/* Category Items */}
                    {isExpanded && (
                      <div className="ml-8 space-y-1">
                        {category.items.map((item) => {
                          const ItemIcon = item.icon;
                          const isActive = location.pathname === item.path;
                          
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setSidebarOpen(false)}
                              className={`flex items-center space-x-3 p-2 rounded-md text-sm transition-colors ${
                                isActive 
                                  ? 'bg-blue-100 text-blue-700 font-medium'
                                  : 'hover:bg-slate-100'
                              }`}
                            >
                              <ItemIcon className="h-4 w-4" />
                              <span className="flex-1">{item.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {item.badge}
                              </Badge>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Access */}
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-2 mb-3">
                Quick Access
              </h3>
              <div className="space-y-1">
                {quickAccess.map((item) => {
                  const ItemIcon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <ItemIcon className="h-5 w-5" />
                      <span className="flex-1 font-medium">{item.name}</span>
                      <Badge className={`${item.badgeColor} text-white text-xs`}>
                        {item.badge}
                      </Badge>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Footer Info */}
            <div className="pt-6 border-t border-slate-200">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-semibold text-slate-700">Platform Stats</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>• 50+ Features</div>
                  <div>• 4 AI Models</div>
                  <div>• 7+ Platforms</div>
                  <div>• Team Ready</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;