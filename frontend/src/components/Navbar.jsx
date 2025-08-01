import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sparkles, Crown, Zap, Brain, Lightbulb, Mic, TrendingUp, Shuffle, Menu, Target, Calendar, BookOpen, BarChart3, Video, Headphones, Mail, PenTool, Package, TestTube, Telescope, Eye, Users2, UserCog, MessageSquareMore, Share2, Send, Database, Workflow, HelpCircle } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="relative">
              <img 
                src="/logo.svg" 
                alt="THREE11 MOTION TECH Logo" 
                className="h-10 sm:h-12 w-10 sm:w-12 group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                THREE11 Generator
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:block">
                AI-Powered Content Suite
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Only show on large screens */}
          <div className="hidden xl:flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <Badge variant="secondary" className="text-xs">
                Group 1, 2 & 3
              </Badge>
            </div>
            
            <div className="flex items-center space-x-1">
              <Link to="/generator">
                <Button 
                  variant={location.pathname === '/generator' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  Gen
                  {location.pathname === '/generator' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link to="/content-creation">
                <Button 
                  variant={location.pathname === '/content-creation' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <Brain className="h-4 w-4 mr-1" />
                  Suite
                  <Badge className="ml-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs">
                    NEW
                  </Badge>
                  {location.pathname === '/content-creation' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link to="/voice-studio">
                <Button 
                  variant={location.pathname === '/voice-studio' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <Mic className="h-4 w-4 mr-1" />
                  Voice
                  <Badge className="ml-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs">
                    BETA
                  </Badge>
                  {location.pathname === '/voice-studio' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link to="/trends-analyzer">
                <Button 
                  variant={location.pathname === '/trends-analyzer' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Trends
                  <Badge className="ml-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs">
                    LIVE
                  </Badge>
                  {location.pathname === '/trends-analyzer' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link to="/content-remix">
                <Button 
                  variant={location.pathname === '/content-remix' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <Shuffle className="h-4 w-4 mr-1" />
                  Remix
                  <Badge className="ml-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs">
                    AI
                  </Badge>
                  {location.pathname === '/content-remix' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              {/* PHASE 2: Power User Features */}
              <Link to="/batch-generator">
                <Button 
                  variant={location.pathname === '/batch-generator' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <Zap className="h-4 w-4 mr-1" />
                  Batch
                  <Badge className="ml-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                    POWER
                  </Badge>
                  {location.pathname === '/batch-generator' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link to="/scheduler">
                <Button 
                  variant={location.pathname === '/scheduler' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Schedule
                  <Badge className="ml-1 bg-gradient-to-r from-blue-500 to-green-500 text-white text-xs">
                    PLAN
                  </Badge>
                  {location.pathname === '/scheduler' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link to="/templates">
                <Button 
                  variant={location.pathname === '/templates' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <BookOpen className="h-4 w-4 mr-1" />
                  Templates
                  <Badge className="ml-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">
                    PRO
                  </Badge>
                  {location.pathname === '/templates' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link to="/analytics">
                <Button 
                  variant={location.pathname === '/analytics' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Analytics
                  <Badge className="ml-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs">
                    INSIGHTS
                  </Badge>
                  {location.pathname === '/analytics' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              {/* PHASE 3: Content Type Expansion */}
              <Link to="/video-content">
                <Button 
                  variant={location.pathname === '/video-content' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <Video className="h-4 w-4 mr-1" />
                  Video
                  <Badge className="ml-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs">
                    CAPTIONS
                  </Badge>
                  {location.pathname === '/video-content' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link to="/podcast-content">
                <Button 
                  variant={location.pathname === '/podcast-content' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <Headphones className="h-4 w-4 mr-1" />
                  Podcast
                  <Badge className="ml-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs">
                    NOTES
                  </Badge>
                  {location.pathname === '/podcast-content' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link to="/email-marketing">
                <Button 
                  variant={location.pathname === '/email-marketing' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                  <Badge className="ml-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs">
                    CAMPAIGNS
                  </Badge>
                  {location.pathname === '/email-marketing' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link to="/blog-generator">
                <Button 
                  variant={location.pathname === '/blog-generator' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <PenTool className="h-4 w-4 mr-1" />
                  Blog
                  <Badge className="ml-1 bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs">
                    SEO
                  </Badge>
                  {location.pathname === '/blog-generator' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link to="/product-descriptions">
                <Button 
                  variant={location.pathname === '/product-descriptions' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <Package className="h-4 w-4 mr-1" />
                  Products
                  <Badge className="ml-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs">
                    E-COMMERCE
                  </Badge>
                  {location.pathname === '/product-descriptions' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              {/* PHASE 4: Intelligence & Insights */}
              <Link to="/intelligence-dashboard">
                <Button 
                  variant={location.pathname === '/intelligence-dashboard' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <Brain className="h-4 w-4 mr-1" />
                  Intelligence
                  <Badge className="ml-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                    AI
                  </Badge>
                  {location.pathname === '/intelligence-dashboard' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link to="/performance-tracker">
                <Button 
                  variant={location.pathname === '/performance-tracker' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Performance
                  <Badge className="ml-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs">
                    ANALYTICS
                  </Badge>
                  {location.pathname === '/performance-tracker' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link to="/engagement-predictor">
                <Button 
                  variant={location.pathname === '/engagement-predictor' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Predict
                  <Badge className="ml-1 bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs">
                    ENGAGE
                  </Badge>
                  {location.pathname === '/engagement-predictor' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link to="/ab-testing-hub">
                <Button 
                  variant={location.pathname === '/ab-testing-hub' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <TestTube className="h-4 w-4 mr-1" />
                  A/B Test
                  <Badge className="ml-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">
                    OPTIMIZE
                  </Badge>
                  {location.pathname === '/ab-testing-hub' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link to="/trend-forecaster">
                <Button 
                  variant={location.pathname === '/trend-forecaster' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <Telescope className="h-4 w-4 mr-1" />
                  Trends
                  <Badge className="ml-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs">
                    FORECAST
                  </Badge>
                  {location.pathname === '/trend-forecaster' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link to="/competitor-monitor">
                <Button 
                  variant={location.pathname === '/competitor-monitor' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <Target className="h-4 w-4 mr-1" />
                  Monitor
                  <Badge className="ml-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs">
                    INTEL
                  </Badge>
                  {location.pathname === '/competitor-monitor' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link to="/competitor-analysis">
                <Button 
                  variant={location.pathname === '/competitor-analysis' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <Target className="h-4 w-4 mr-1" />
                  Compete
                  <Badge className="ml-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs">
                    NEW
                  </Badge>
                  {location.pathname === '/competitor-analysis' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              {/* PHASE 5: Team Collaboration Platform */}
              <Link to="/team-dashboard">
                <Button 
                  variant={location.pathname === '/team-dashboard' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <Users2 className="h-4 w-4 mr-1" />
                  Teams
                  <Badge className="ml-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs">
                    COLLAB
                  </Badge>
                  {location.pathname === '/team-dashboard' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link to="/team-management">
                <Button 
                  variant={location.pathname === '/team-management' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <UserCog className="h-4 w-4 mr-1" />
                  Manage
                  <Badge className="ml-1 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs">
                    ADMIN
                  </Badge>
                  {location.pathname === '/team-management' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-violet-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link to="/role-management">
                <Button 
                  variant={location.pathname === '/role-management' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <Crown className="h-4 w-4 mr-1" />
                  Roles
                  <Badge className="ml-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">
                    PERMISSIONS
                  </Badge>
                  {location.pathname === '/role-management' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link to="/collaboration-tools">
                <Button 
                  variant={location.pathname === '/collaboration-tools' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <MessageSquareMore className="h-4 w-4 mr-1" />
                  Collaborate
                  <Badge className="ml-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs">
                    WORKFLOW
                  </Badge>
                  {location.pathname === '/collaboration-tools' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              {/* PHASE 6: Social Media Automation */}
              <Link to="/social-dashboard">
                <Button 
                  variant={location.pathname === '/social-dashboard' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Dashboard
                  <Badge className="ml-1 bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-xs">
                    SOCIAL
                  </Badge>
                  {location.pathname === '/social-dashboard' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link to="/social-publishing">
                <Button 
                  variant={location.pathname === '/social-publishing' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <Send className="h-4 w-4 mr-1" />
                  Publishing
                  <Badge className="ml-1 bg-gradient-to-r from-teal-500 to-green-500 text-white text-xs">
                    POST
                  </Badge>
                  {location.pathname === '/social-publishing' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-teal-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link to="/automation-workflows">
                <Button 
                  variant={location.pathname === '/automation-workflows' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <Workflow className="h-4 w-4 mr-1" />
                  Automation
                  <Badge className="ml-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                    AUTO
                  </Badge>
                  {location.pathname === '/automation-workflows' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link to="/crm-integration">
                <Button 
                  variant={location.pathname === '/crm-integration' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <Database className="h-4 w-4 mr-1" />
                  CRM
                  <Badge className="ml-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs">
                    SYNC
                  </Badge>
                  {location.pathname === '/crm-integration' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link to="/getting-started">
                <Button 
                  variant={location.pathname === '/getting-started' ? 'default' : 'ghost'}
                  className="relative px-2"
                  size="sm"
                >
                  <HelpCircle className="h-4 w-4 mr-1" />
                  Guide
                  <Badge className="ml-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs">
                    HELP
                  </Badge>
                  {location.pathname === '/getting-started' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link to="/premium">
                <Button 
                  variant={location.pathname === '/premium' ? 'default' : 'outline'}
                  className="relative px-2"
                  size="sm"
                >
                  <Crown className="h-4 w-4 mr-1" />
                  Pro
                  <Badge className="ml-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">
                    Pro
                  </Badge>
                </Button>
              </Link>
            </div>
          </div>

          {/* Always visible Get Started + Menu for smaller screens */}
          <div className="flex items-center space-x-2">
            {/* Menu button for tablet screens */}
            <Button 
              variant="ghost" 
              size="sm"
              className="xl:hidden p-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Always visible auth buttons */}
            <Link 
              to="/auth"
              className="text-slate-600 hover:text-slate-900 px-2 sm:px-4 hidden sm:flex items-center justify-center h-9 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Sign In
            </Link>
            <Link 
              to="/auth"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 sm:px-4 h-9 rounded-md text-sm font-medium transition-colors inline-flex items-center justify-center"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;