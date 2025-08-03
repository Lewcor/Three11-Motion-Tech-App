import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Complete Content Creation
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Suite for All Platforms
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
              From viral captions to video scripts, content ideas to trending topics - everything creators need for TikTok, Instagram, YouTube, and Facebook. Powered by Group 1 (Creative & Engaging), Group 2 (Thoughtful & Nuanced), and Group 3 (Trendy & Current) working together.
            </p>
            
            {/* Platform Icons */}
            <div className="flex justify-center space-x-8 mb-10">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📱</span>
                <span className="font-medium">TikTok</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📸</span>
                <span className="font-medium">Instagram</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📺</span>
                <span className="font-medium">YouTube</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">👥</span>
                <span className="font-medium">Facebook</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link 
                to="/generator"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                Try FREE Demo Now!
              </Link>
              <Link 
                to="/generator"
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                Start Creating Now
              </Link>
              <Link 
                to="/content-creation"
                className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
              >
                Explore Content Suite
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">4.9/5</div>
              <div className="text-gray-600">Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">50K+</div>
              <div className="text-gray-600">Creators</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">10M+</div>
              <div className="text-gray-600">Posts Generated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">7</div>
              <div className="text-gray-600">Content Tools</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">THREE11 MOTION TECH</h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            The world's first AI system that combines three leading AI providers for unmatched creativity
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-3">Group 1 - Creative & Engaging</h3>
              <p className="text-gray-600">Creative & Engaging content generation</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-bold mb-3">Group 2 - Thoughtful & Nuanced</h3>
              <p className="text-gray-600">Thoughtful & Nuanced content creation</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-bold mb-3">Group 3 - Trendy & Current</h3>
              <p className="text-gray-600">Trendy & Current content optimization</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Tools */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Complete Content Creation Suite</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/generator" className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">💡</div>
              <h3 className="font-bold mb-2">Content Ideas</h3>
              <p className="text-gray-600 text-sm">Unlimited creative inspiration tailored to your niche</p>
            </Link>
            
            <Link to="/video-scripts" className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🎬</div>
              <h3 className="font-bold mb-2">Video Scripts</h3>
              <p className="text-gray-600 text-sm">Complete scripts with hooks, content, and CTAs</p>
            </Link>
            
            <Link to="/trends-analyzer" className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📈</div>
              <h3 className="font-bold mb-2">Trending Topics</h3>
              <p className="text-gray-600 text-sm">Real-time trend analysis for viral content</p>
            </Link>
            
            <Link to="/strategy-planner" className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📊</div>
              <h3 className="font-bold mb-2">Strategy Planner</h3>
              <p className="text-gray-600 text-sm">Comprehensive content strategies for growth</p>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Dominate All Platforms?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of creators using THREE11 MOTION TECH to create viral content for TikTok, Instagram, YouTube, and Facebook
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              to="/generator"
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              Start Creating Now
            </Link>
            <Link 
              to="/content-creation"
              className="px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              Explore Content Suite
            </Link>
          </div>
          
          <div className="mt-12 flex justify-center items-center space-x-8 text-blue-100">
            <div className="flex items-center space-x-2">
              <span>✨</span>
              <span>9 Content Categories</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🤖</span>
              <span>3 AI Providers</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>📱</span>
              <span>4 Platforms</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🎨</span>
              <span>7 Creation Tools</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;