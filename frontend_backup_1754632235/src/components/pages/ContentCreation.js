import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ContentCreation = () => {
  const [activeTab, setActiveTab] = useState('all');

  const contentTools = [
    {
      id: 'caption-generator',
      title: 'Caption Generator',
      description: 'Generate viral captions for all platforms',
      icon: '✨',
      category: 'core',
      status: 'active',
      link: '/generator',
      features: ['Platform-specific', 'Category-optimized', 'Hashtag suggestions']
    },
    {
      id: 'voice-studio',
      title: 'Voice Studio',
      description: 'AI-powered voice creation',
      icon: '🎤',
      category: 'power',
      status: 'beta',
      link: '/voice-studio',
      features: ['Multiple voices', 'Custom speed/pitch', 'Export ready']
    },
    {
      id: 'trends-analyzer',
      title: 'Trends Analyzer',
      description: 'Real-time trend analysis',
      icon: '📈',
      category: 'analytics',
      status: 'live',
      link: '/trends-analyzer',
      features: ['Live data', 'Platform insights', 'Viral predictions']
    },
    {
      id: 'content-remix',
      title: 'Content Remix',
      description: 'Transform existing content',
      icon: '🔄',
      category: 'power',
      status: 'active',
      link: '/content-remix',
      features: ['AI-powered', 'Style transformation', 'Viral optimization']
    },
    {
      id: 'video-scripts',
      title: 'Video Script Generator',
      description: 'Complete video scripts with hooks and CTAs',
      icon: '📝',
      category: 'content',
      status: 'coming-soon',
      link: '/video-scripts',
      features: ['Hook templates', 'CTA optimization', 'Timestamp guides']
    },
    {
      id: 'hashtag-research',
      title: 'Hashtag Research',
      description: 'Find trending hashtags for maximum reach',
      icon: '#️⃣',
      category: 'analytics',
      status: 'coming-soon',
      link: '#',
      features: ['Trend analysis', 'Competition insights', 'Growth predictions']
    },
    {
      id: 'content-calendar',
      title: 'Content Calendar',
      description: 'Plan and schedule your content strategy',
      icon: '📅',
      category: 'planning',
      status: 'coming-soon',
      link: '/strategy-planner',
      features: ['Smart scheduling', 'Platform optimization', 'Performance tracking']
    },
    {
      id: 'brand-voice',
      title: 'Brand Voice Analyzer',
      description: 'Maintain consistent brand voice across content',
      icon: '🎯',
      category: 'brand',
      status: 'coming-soon',
      link: '#',
      features: ['Voice consistency', 'Brand alignment', 'Tone analysis']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Tools', icon: '🌟' },
    { id: 'core', name: 'Core Features', icon: '📱' },
    { id: 'power', name: 'Power Features', icon: '⚡' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'content', name: 'Content Studio', icon: '🎬' },
    { id: 'planning', name: 'Planning', icon: '📋' },
    { id: 'brand', name: 'Brand Tools', icon: '🏢' }
  ];

  const filteredTools = activeTab === 'all' 
    ? contentTools 
    : contentTools.filter(tool => tool.category === activeTab);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'beta':
        return 'bg-orange-100 text-orange-800';
      case 'live':
        return 'bg-red-100 text-red-800';
      case 'coming-soon':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'active':
        return 'ACTIVE';
      case 'beta':
        return 'BETA';
      case 'live':
        return 'LIVE';
      case 'coming-soon':
        return 'COMING SOON';
      default:
        return 'NEW';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with NEW badge */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <h1 className="text-4xl font-bold text-gray-900">🎨 Content Suite</h1>
            <span className="px-3 py-1 bg-green-100 text-green-800 font-bold text-sm rounded-full">NEW</span>
          </div>
          <p className="text-xl text-gray-600">Complete toolkit for content creation across all platforms</p>
        </div>

        {/* Category Tabs */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`px-4 py-2 rounded-full border-2 transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === category.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <span>{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredTools.map((tool) => {
            const isComingSoon = tool.status === 'coming-soon';
            const Component = isComingSoon ? 'div' : Link;
            const props = isComingSoon ? {} : { to: tool.link };

            return (
              <Component
                key={tool.id}
                {...props}
                className={`bg-white rounded-2xl shadow-lg p-6 transition-all duration-200 ${
                  isComingSoon 
                    ? 'opacity-75 cursor-not-allowed' 
                    : 'hover:shadow-xl hover:scale-105 cursor-pointer'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{tool.icon}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusBadge(tool.status)}`}>
                    {getStatusText(tool.status)}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">{tool.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                
                <div className="space-y-2">
                  {tool.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs text-gray-500">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {!isComingSoon && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-600 font-medium">Launch Tool</span>
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </Component>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Platform Performance</h3>
            <p className="text-gray-600">Content Suite tools across all platforms</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">7+</div>
              <div className="text-blue-800 font-medium">Creation Tools</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">4</div>
              <div className="text-purple-800 font-medium">Platforms Supported</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">9</div>
              <div className="text-green-800 font-medium">Content Categories</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
              <div className="text-3xl font-bold text-orange-600 mb-2">3</div>
              <div className="text-orange-800 font-medium">AI Providers</div>
            </div>
          </div>
        </div>

        {/* Featured Workflow */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-xl p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">🚀 Recommended Workflow</h3>
            <p className="text-purple-100 text-lg">The optimal content creation process for maximum engagement</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h4 className="font-bold mb-2">1. Analyze Trends</h4>
              <p className="text-purple-100 text-sm">Start with Trends Analyzer to find viral topics</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h4 className="font-bold mb-2">2. Generate Content</h4>
              <p className="text-purple-100 text-sm">Use Caption Generator for platform-specific content</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h4 className="font-bold mb-2">3. Remix & Optimize</h4>
              <p className="text-purple-100 text-sm">Transform with Content Remix for viral potential</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h4 className="font-bold mb-2">4. Plan & Schedule</h4>
              <p className="text-purple-100 text-sm">Organize with Strategy Planner for consistent posting</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCreation;