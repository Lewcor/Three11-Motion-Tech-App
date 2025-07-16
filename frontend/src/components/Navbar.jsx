import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sparkles, Crown, Zap, Brain, Lightbulb, Mic, TrendingUp } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Caption Generator
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Powered by THREE11 MOTION TECH
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <Badge variant="secondary" className="text-xs">
                OpenAI + Claude + Gemini
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link to="/generator">
                <Button 
                  variant={location.pathname === '/generator' ? 'default' : 'ghost'}
                  className="relative"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generator
                  {location.pathname === '/generator' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link to="/content-creation">
                <Button 
                  variant={location.pathname === '/content-creation' ? 'default' : 'ghost'}
                  className="relative"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Content Suite
                  <Badge className="ml-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs">
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
                  className="relative"
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Voice Studio
                  <Badge className="ml-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs">
                    BETA
                  </Badge>
                  {location.pathname === '/voice-studio' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
              
              <Link to="/premium">
                <Button 
                  variant={location.pathname === '/premium' ? 'default' : 'outline'}
                  className="relative"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Premium
                  <Badge className="ml-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">
                    Pro
                  </Badge>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;