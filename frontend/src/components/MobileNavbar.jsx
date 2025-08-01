import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Sparkles, Crown, Zap, Brain, Menu, X, Mic, TrendingUp, Shuffle, Target, Calendar, BookOpen, BarChart3, Video, Headphones, Mail, PenTool, Package, TestTube, Telescope, Eye, Users2, UserCog, MessageSquareMore, Share2, Send, Database, Workflow, HelpCircle } from 'lucide-react';

const MobileNavbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { 
      path: '/generator', 
      name: 'Generator', 
      icon: <Sparkles className="h-4 w-4" />,
      badge: null
    },
    { 
      path: '/content-creation', 
      name: 'Content Suite', 
      icon: <Brain className="h-4 w-4" />,
      badge: 'NEW'
    },
    { 
      path: '/voice-studio', 
      name: 'Voice Studio', 
      icon: <Mic className="h-4 w-4" />,
      badge: 'BETA'
    },
    { 
      path: '/trends-analyzer', 
      name: 'Trends Analyzer', 
      icon: <TrendingUp className="h-4 w-4" />,
      badge: 'LIVE'
    },
    { 
      path: '/content-remix', 
      name: 'Content Remix', 
      icon: <Shuffle className="h-4 w-4" />,
      badge: 'AI'
    },
    // PHASE 2: Power User Features
    { 
      path: '/batch-generator', 
      name: 'Batch Generator', 
      icon: <Zap className="h-4 w-4" />,
      badge: 'POWER'
    },
    { 
      path: '/scheduler', 
      name: 'Content Scheduler', 
      icon: <Calendar className="h-4 w-4" />,
      badge: 'PLAN'
    },
    { 
      path: '/templates', 
      name: 'Template Library', 
      icon: <BookOpen className="h-4 w-4" />,
      badge: 'PRO'
    },
    { 
      path: '/analytics', 
      name: 'Advanced Analytics', 
      icon: <BarChart3 className="h-4 w-4" />,
      badge: 'INSIGHTS'
    },
    // PHASE 3: Content Type Expansion
    { 
      path: '/video-content', 
      name: 'Video Content', 
      icon: <Video className="h-4 w-4" />,
      badge: 'CAPTIONS'
    },
    { 
      path: '/podcast-content', 
      name: 'Podcast Content', 
      icon: <Headphones className="h-4 w-4" />,
      badge: 'NOTES'
    },
    { 
      path: '/email-marketing', 
      name: 'Email Marketing', 
      icon: <Mail className="h-4 w-4" />,
      badge: 'CAMPAIGNS'
    },
    { 
      path: '/blog-generator', 
      name: 'Blog Generator', 
      icon: <PenTool className="h-4 w-4" />,
      badge: 'SEO'
    },
    { 
      path: '/product-descriptions', 
      name: 'Product Descriptions', 
      icon: <Package className="h-4 w-4" />,
      badge: 'E-COMMERCE'
    },
    // PHASE 4: Intelligence & Insights
    { 
      path: '/intelligence-dashboard', 
      name: 'Intelligence Dashboard', 
      icon: <Brain className="h-4 w-4" />,
      badge: 'AI'
    },
    { 
      path: '/performance-tracker', 
      name: 'Performance Tracker', 
      icon: <BarChart3 className="h-4 w-4" />,
      badge: 'ANALYTICS'
    },
    { 
      path: '/engagement-predictor', 
      name: 'Engagement Predictor', 
      icon: <Eye className="h-4 w-4" />,
      badge: 'PREDICT'
    },
    { 
      path: '/ab-testing-hub', 
      name: 'A/B Testing Hub', 
      icon: <TestTube className="h-4 w-4" />,
      badge: 'OPTIMIZE'
    },
    { 
      path: '/trend-forecaster', 
      name: 'Trend Forecaster', 
      icon: <Telescope className="h-4 w-4" />,
      badge: 'FORECAST'
    },
    { 
      path: '/competitor-monitor', 
      name: 'Competitor Monitor', 
      icon: <Target className="h-4 w-4" />,
      badge: 'INTEL'
    },
    { 
      path: '/competitor-analysis', 
      name: 'Competitor Analysis', 
      icon: <Target className="h-4 w-4" />,
      badge: 'NEW'
    },
    // PHASE 5: Team Collaboration Platform
    { 
      path: '/team-dashboard', 
      name: 'Team Dashboard', 
      icon: <Users2 className="h-4 w-4" />,
      badge: 'COLLAB'
    },
    { 
      path: '/team-management', 
      name: 'Team Management', 
      icon: <UserCog className="h-4 w-4" />,
      badge: 'ADMIN'
    },
    { 
      path: '/role-management', 
      name: 'Role Management', 
      icon: <Crown className="h-4 w-4" />,
      badge: 'PERMISSIONS'
    },
    { 
      path: '/collaboration-tools', 
      name: 'Collaboration Tools', 
      icon: <MessageSquareMore className="h-4 w-4" />,
      badge: 'WORKFLOW'
    },
    // PHASE 6: Social Media Automation
    { 
      path: '/social-dashboard', 
      name: 'Social Dashboard', 
      icon: <Share2 className="h-4 w-4" />,
      badge: 'SOCIAL'
    },
    { 
      path: '/social-publishing', 
      name: 'Social Publishing', 
      icon: <Send className="h-4 w-4" />,
      badge: 'POST'
    },
    { 
      path: '/automation-workflows', 
      name: 'Automation', 
      icon: <Workflow className="h-4 w-4" />,
      badge: 'AUTO'
    },
    { 
      path: '/crm-integration', 
      name: 'CRM Integration', 
      icon: <Database className="h-4 w-4" />,
      badge: 'SYNC'
    },
    { 
      path: '/premium', 
      name: 'Premium', 
      icon: <Crown className="h-4 w-4" />,
      badge: 'Pro'
    }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 dark:bg-slate-900/90 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
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
                AI Content Creation
              </span>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-8">
                {/* Header */}
                <div className="flex items-center space-x-2 mb-6">
                  <img 
                    src="/logo.svg" 
                    alt="THREE11 MOTION TECH Logo" 
                    className="h-8 w-8"
                  />
                  <div>
                    <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      THREE11 MOTION TECH
                    </span>
                    <div className="flex items-center space-x-1 mt-1">
                      <Zap className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs text-slate-500">
                        Group 1, 2 & 3
                      </span>
                    </div>
                  </div>
                </div>

                {/* Navigation Items */}
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                    {item.badge && (
                      <Badge 
                        className={`ml-auto text-xs ${
                          item.badge === 'NEW' 
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                            : item.badge === 'BETA'
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                            : item.badge === 'LIVE'
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                            : item.badge === 'AI'
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                            : item.badge === 'POWER'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : item.badge === 'PLAN'
                            ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
                            : item.badge === 'PRO'
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                            : item.badge === 'INSIGHTS'
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                            : item.badge === 'CAPTIONS'
                            ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                            : item.badge === 'NOTES'
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                            : item.badge === 'CAMPAIGNS'
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                            : item.badge === 'SEO'
                            ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                            : item.badge === 'E-COMMERCE'
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                            : item.badge === 'ANALYTICS'
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                            : item.badge === 'PREDICT'
                            ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                            : item.badge === 'OPTIMIZE'
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                            : item.badge === 'FORECAST'
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                            : item.badge === 'INTEL'
                            ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                            : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                ))}

                {/* Features */}
                <div className="border-t pt-4 mt-6">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                    Features
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>9 Content Categories</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>4 Social Platforms</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>3 AI Providers</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>7 Creation Tools</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      <span>Voice Processing</span>
                    </div>
                  </div>
                </div>

                {/* Platforms */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                    Supported Platforms
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <span>📱</span>
                      <span>TikTok</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <span>📸</span>
                      <span>Instagram</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <span>📺</span>
                      <span>YouTube</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <span>👥</span>
                      <span>Facebook</span>
                    </div>
                  </div>
                </div>

                {/* Authentication */}
                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <Link 
                      to="/auth" 
                      onClick={() => setIsOpen(false)}
                      className="w-full h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition-colors inline-flex items-center justify-center"
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/auth" 
                      onClick={() => setIsOpen(false)}
                      className="w-full h-10 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md text-sm font-medium transition-colors inline-flex items-center justify-center hover:from-blue-700 hover:to-purple-700"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>

                {/* CTA */}
                <div className="border-t pt-4">
                  <Link to="/premium" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Premium
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/generator">
              <Button 
                variant={location.pathname === '/generator' ? 'default' : 'ghost'}
                size="sm"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </Link>
            <Link to="/premium">
              <Button 
                variant={location.pathname === '/premium' ? 'default' : 'outline'}
                size="sm"
              >
                <Crown className="h-4 w-4 mr-2" />
                Premium
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MobileNavbar;