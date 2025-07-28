import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sparkles, Crown, Zap, Brain, Lightbulb, Mic, TrendingUp, Shuffle, Menu } from 'lucide-react';

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
            <Button 
              variant="ghost" 
              className="text-slate-600 hover:text-slate-900 px-2 sm:px-4 hidden sm:flex"
              size="sm"
            >
              Sign In
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 sm:px-4"
              size="sm"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;