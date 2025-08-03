import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavigationSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigationCategories = [
    {
      title: "Core Features",
      icon: "📱",
      items: [
        {
          path: '/generator',
          label: 'Caption Generator',
          description: 'Generate viral captions instantly',
          icon: '✨'
        },
        {
          path: '/voice-studio',
          label: 'Voice Studio',
          description: 'AI-powered voice creation',
          icon: '🎤',
          badge: 'BETA'
        },
        {
          path: '/trends-analyzer',
          label: 'Trends Analyzer',
          description: 'Real-time trend analysis',
          icon: '📈',
          badge: 'LIVE'
        }
      ]
    },
    {
      title: "Power Features",
      icon: "⚡",
      items: [
        {
          path: '/content-remix',
          label: 'Content Remix',
          description: 'AI-powered content remixing',
          icon: '🔄',
          badge: 'AI'
        },
        {
          path: '/content-creation',
          label: 'Content Suite',
          description: 'Complete content creation toolkit',
          icon: '🎨',
          badge: 'NEW'
        }
      ]
    },
    {
      title: "Premium",
      icon: "💎",
      items: [
        {
          path: '/premium',
          label: 'View Premium',
          description: 'Unlock advanced features',
          icon: '⭐'
        }
      ]
    },
    {
      title: "Content Studio",
      icon: "🎬",
      items: [
        {
          path: '/content-studio',
          label: 'Content Studio',
          description: 'Professional content workspace',
          icon: '🎭'
        },
        {
          path: '/video-scripts',
          label: 'Video Scripts',
          description: 'Complete video script generation',
          icon: '📝'
        },
        {
          path: '/strategy-planner',
          label: 'Strategy Planner',
          description: 'Content strategy and planning',
          icon: '📊'
        }
      ]
    },
    {
      title: "Team Hub",
      icon: "👥",
      items: [
        {
          path: '/team-collaboration',
          label: 'Team Collaboration',
          description: 'Work together seamlessly',
          icon: '🤝'
        },
        {
          path: '/analytics-dashboard',
          label: 'Analytics Dashboard',
          description: 'Track content performance',
          icon: '📈'
        }
      ]
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-content font-bold text-sm">
              311
            </div>
            <div>
              <h2 className="font-bold text-lg">THREE11 MOTION TECH</h2>
              <p className="text-gray-400 text-sm">Navigation Menu</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Content */}
        <div className="overflow-y-auto h-full pb-20">
          <div className="p-4">
            {navigationCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-8">
                {/* Category Header */}
                <div className="flex items-center space-x-2 mb-4 px-2">
                  <span className="text-lg">{category.icon}</span>
                  <h3 className="font-semibold text-gray-300 uppercase text-sm tracking-wider">
                    {category.title}
                  </h3>
                </div>

                {/* Category Items */}
                <div className="space-y-1">
                  {category.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      to={item.path}
                      onClick={onClose}
                      className={`
                        flex items-center space-x-3 p-3 rounded-xl transition-all duration-200
                        ${isActiveRoute(item.path) 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                          : 'hover:bg-gray-800 text-gray-300 hover:text-white'
                        }
                      `}
                    >
                      <span className="text-xl flex-shrink-0">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium truncate">{item.label}</span>
                          {item.badge && (
                            <span className={`
                              px-2 py-0.5 text-xs font-bold rounded-full
                              ${item.badge === 'NEW' ? 'bg-green-500 text-white' : 
                                item.badge === 'BETA' ? 'bg-orange-500 text-white' :
                                item.badge === 'LIVE' ? 'bg-red-500 text-white' :
                                item.badge === 'AI' ? 'bg-purple-500 text-white' :
                                'bg-blue-500 text-white'}
                            `}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 truncate">{item.description}</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Additional Info */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl">
              <h4 className="font-bold text-white mb-2">🚀 Platform Stats</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-center">
                  <div className="font-bold text-blue-300">50K+</div>
                  <div className="text-gray-300">Creators</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-purple-300">10M+</div>
                  <div className="text-gray-300">Posts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationSidebar;