import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Sparkles, Crown, Zap, Brain, Menu, X, Mic, TrendingUp, Shuffle } from 'lucide-react';

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