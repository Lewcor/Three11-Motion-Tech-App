import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sparkles, Crown, Zap, Brain, Lightbulb, Mic, TrendingUp, Shuffle, Menu, Target, Calendar, BookOpen, BarChart3, Video, Headphones, Mail, PenTool, Package, TestTube, Telescope, Eye, Users2, UserCog, MessageSquareMore, Share2, Send, Database, Workflow, HelpCircle, Monitor, ChevronDown, X } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navCategories = [
    {
      id: 'core',
      name: 'Core Features',
      icon: Sparkles,
      badge: 'MAIN',
      badgeColor: 'bg-gradient-to-r from-blue-500 to-purple-500',
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
      badgeColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
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
      badgeColor: 'bg-gradient-to-r from-green-500 to-blue-500',
      items: [
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
      badgeColor: 'bg-gradient-to-r from-cyan-500 to-blue-500',
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
      badgeColor: 'bg-gradient-to-r from-orange-500 to-red-500',
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
      badgeColor: 'bg-gradient-to-r from-indigo-500 to-purple-500',
      items: [
        { path: '/social-dashboard', name: 'Social Dashboard', icon: Share2, badge: 'SOCIAL' },
        { path: '/social-publishing', name: 'Social Publishing', icon: Send, badge: 'PUBLISH' },
        { path: '/automation-workflows', name: 'Automation Workflows', icon: Workflow, badge: 'AUTO' },
        { path: '/crm-integration', name: 'CRM Integration', icon: Database, badge: 'CRM' }
      ]
    }
  ];

  const quickAccess = [
    { path: '/getting-started', name: 'Guide', icon: HelpCircle, badge: 'HELP', badgeColor: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { path: '/presentation', name: 'Demo', icon: Monitor, badge: 'DEMO', badgeColor: 'bg-gradient-to-r from-green-500 to-emerald-500' },
    { path: '/user-guide', name: 'Manual', icon: BookOpen, badge: 'GUIDE', badgeColor: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { path: '/premium', name: 'Pro', icon: Crown, badge: 'Pro', badgeColor: 'bg-gradient-to-r from-amber-500 to-orange-500' }
  ];

  const toggleDropdown = (categoryId) => {
    setOpenDropdown(openDropdown === categoryId ? null : categoryId);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="relative">
              <Crown className="h-8 w-8 text-yellow-500 group-hover:scale-105 transition-transform duration-200" />
            </div>
            <div className="flex flex-col">
              <span className="text-md sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                THREE11 MOTION TECH
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:block">
                AI-Powered Social Media Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Category Dropdowns */}
            {navCategories.map((category) => {
              const CategoryIcon = category.icon;
              const isActive = category.items.some(item => location.pathname === item.path);
              
              return (
                <div key={category.id} className="relative">
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className="relative px-3 py-2"
                    onClick={() => toggleDropdown(category.id)}
                  >
                    <CategoryIcon className="h-4 w-4 mr-2" />
                    {category.name}
                    <Badge className={`ml-2 ${category.badgeColor} text-white text-xs`}>
                      {category.badge}
                    </Badge>
                    <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${openDropdown === category.id ? 'rotate-180' : ''}`} />
                    {isActive && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </Button>
                  
                  {/* Dropdown Menu */}
                  {openDropdown === category.id && (
                    <div className="absolute top-full left-0 mt-2 w-72 bg-white/98 backdrop-blur-md border border-slate-200 rounded-lg shadow-xl z-50">
                      <div className="p-3">
                        <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 px-2 flex items-center">
                          <CategoryIcon className="h-4 w-4 mr-2" />
                          {category.name}
                        </div>
                        {category.items.map((item) => {
                          const ItemIcon = item.icon;
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setOpenDropdown(null)}
                              className={`flex items-center px-3 py-3 rounded-lg text-sm transition-all hover:bg-slate-50 ${
                                location.pathname === item.path
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'hover:bg-slate-50'
                              }`}
                            >
                              <ItemIcon className="h-4 w-4 mr-3 text-slate-500" />
                              <span className="flex-1 font-medium">{item.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {item.badge}
                              </Badge>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Quick Access Items */}
            <div className="flex items-center space-x-1 ml-6 pl-6 border-l border-slate-300">
              {quickAccess.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button 
                      variant={location.pathname === item.path ? 'default' : 'ghost'}
                      className="relative px-3"
                      size="sm"
                    >
                      <ItemIcon className="h-4 w-4 mr-1" />
                      {item.name}
                      <Badge className={`ml-1 ${item.badgeColor} text-white text-xs`}>
                        {item.badge}
                      </Badge>
                      {location.pathname === item.path && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Click outside to close dropdown */}
        {openDropdown && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setOpenDropdown(null)}
          />
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-md border-t border-slate-200 shadow-lg">
          <div className="px-4 py-4 space-y-4 max-h-96 overflow-y-auto">
            {navCategories.map((category) => {
              const CategoryIcon = category.icon;
              return (
                <div key={category.id}>
                  <div className="flex items-center text-sm font-bold text-slate-700 px-2 py-2 bg-slate-50 rounded-lg">
                    <CategoryIcon className="h-4 w-4 mr-2" />
                    {category.name}
                    <Badge className={`ml-auto ${category.badgeColor} text-white text-xs`}>
                      {category.badge}
                    </Badge>
                  </div>
                  <div className="space-y-1 ml-4 mt-2">
                    {category.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                            location.pathname === item.path
                              ? 'bg-blue-100 text-blue-700'
                              : 'hover:bg-slate-100'
                          }`}
                        >
                          <ItemIcon className="h-4 w-4 mr-3" />
                          {item.name}
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {item.badge}
                          </Badge>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            
            <div className="border-t pt-4 mt-4">
              <div className="text-sm font-bold text-slate-700 px-2 py-2 bg-slate-50 rounded-lg">
                Quick Access
              </div>
              <div className="space-y-1 ml-4 mt-2">
                {quickAccess.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                        location.pathname === item.path
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-slate-100'
                      }`}
                    >
                      <ItemIcon className="h-4 w-4 mr-3" />
                      {item.name}
                      <Badge className={`ml-auto ${item.badgeColor} text-white text-xs`}>
                        {item.badge}
                      </Badge>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;