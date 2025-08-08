import React, { useState, useEffect } from 'react';

const TrendsAnalyzer = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [liveData, setLiveData] = useState(true);

  const platforms = [
    { id: 'all', name: 'All Platforms', icon: '🌐', color: 'bg-gray-100 text-gray-800' },
    { id: 'tiktok', name: 'TikTok', icon: '📱', color: 'bg-pink-100 text-pink-800' },
    { id: 'instagram', name: 'Instagram', icon: '📸', color: 'bg-purple-100 text-purple-800' },
    { id: 'youtube', name: 'YouTube', icon: '📺', color: 'bg-red-100 text-red-800' },
    { id: 'facebook', name: 'Facebook', icon: '👥', color: 'bg-blue-100 text-blue-800' },
  ];

  const trendingHashtags = [
    { tag: '#ContentCreator', growth: '+245%', platform: 'All', volume: '2.4M' },
    { tag: '#AIContent', growth: '+189%', platform: 'TikTok', volume: '1.8M' },
    { tag: '#ViralTrend', growth: '+156%', platform: 'Instagram', volume: '3.2M' },
    { tag: '#CreatorTips', growth: '+134%', platform: 'YouTube', volume: '985K' },
    { tag: '#SocialMedia', growth: '+123%', platform: 'Facebook', volume: '1.5M' },
    { tag: '#TrendAlert', growth: '+112%', platform: 'All', volume: '867K' },
  ];

  const viralContent = [
    {
      title: 'AI-Generated Content Takes Over',
      platform: 'TikTok',
      engagement: '15.2M',
      trend: 'up',
      category: 'Technology'
    },
    {
      title: 'Minimalist Aesthetic Trends',
      platform: 'Instagram',
      engagement: '8.7M',
      trend: 'up',
      category: 'Fashion'
    },
    {
      title: 'Educational Content Surge',
      platform: 'YouTube',
      engagement: '12.1M',
      trend: 'up',
      category: 'Education'
    },
    {
      title: 'Community Building Focus',
      platform: 'Facebook',
      engagement: '6.3M',
      trend: 'stable',
      category: 'Community'
    }
  ];

  useEffect(() => {
    // Simulate live data updates
    const interval = setInterval(() => {
      setLiveData(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with LIVE badge */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <h1 className="text-4xl font-bold text-gray-900">📈 Trends Analyzer</h1>
            <span className="px-3 py-1 bg-red-100 text-red-800 font-bold text-sm rounded-full animate-pulse">LIVE</span>
          </div>
          <p className="text-xl text-gray-600">Real-time trend analysis for viral content creation</p>
        </div>

        {/* Platform Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`px-4 py-2 rounded-full border-2 transition-all duration-200 flex items-center space-x-2 ${
                  selectedPlatform === platform.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <span>{platform.icon}</span>
                <span className="font-medium">{platform.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Trending Hashtags */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">🔥 Trending Hashtags</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${liveData ? 'bg-green-500' : 'bg-gray-400'} animate-pulse`}></div>
                  <span className="text-sm text-gray-600">Live Updates</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {trendingHashtags.map((hashtag, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                      <div>
                        <h4 className="font-bold text-gray-900">{hashtag.tag}</h4>
                        <p className="text-sm text-gray-600">{hashtag.platform} • {hashtag.volume} posts</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-bold">{hashtag.growth}</div>
                      <div className="text-xs text-gray-500">24h growth</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Viral Content Analysis */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">🚀 Viral Content Analysis</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {viralContent.map((content, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 flex-1">{content.title}</h4>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        platforms.find(p => p.name === content.platform)?.color || 'bg-gray-100 text-gray-800'
                      }`}>
                        {content.platform}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Engagement:</span>
                        <span className="font-bold text-blue-600">{content.engagement}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {content.trend === 'up' ? (
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="text-sm text-gray-600">{content.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Insights */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">⚡ Real-time Insights</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Peak Posting Time</h4>
                  <p className="text-sm text-gray-700">Best time to post today: <strong>3:00 PM - 5:00 PM EST</strong></p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Rising Category</h4>
                  <p className="text-sm text-gray-700">AI & Technology content is <strong>+340% trending</strong></p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Engagement Boost</h4>
                  <p className="text-sm text-gray-700">Use video format for <strong>2.3x more engagement</strong></p>
                </div>
              </div>
            </div>

            {/* Trend Alerts */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🔔 Trend Alerts</h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                  <span className="text-red-500 text-sm">🚨</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">Viral Alert</p>
                    <p className="text-xs text-red-600">#AICreator is exploding on TikTok</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <span className="text-yellow-500 text-sm">⚠️</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800">Trending Down</p>
                    <p className="text-xs text-yellow-600">#OldTrend losing momentum</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-500 text-sm">ℹ️</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-800">New Opportunity</p>
                    <p className="text-xs text-blue-600">Educational content gaining traction</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Export Trends</h3>
              
              <div className="space-y-3">
                <button className="w-full p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                  Download Trend Report
                </button>
                <button className="w-full p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
                  Export Hashtag List
                </button>
                <button className="w-full p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium">
                  Share Insights
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendsAnalyzer;