import React from 'react';
import { Link } from 'react-router-dom';

const Premium = () => {
  const features = [
    {
      category: "Core Features",
      icon: "📱",
      items: [
        { name: "Unlimited Caption Generation", included: true },
        { name: "All 9 Content Categories", included: true },
        { name: "4 Platform Optimization", included: true },
        { name: "Basic Hashtag Suggestions", included: true }
      ]
    },
    {
      category: "Power Features",
      icon: "⚡",
      items: [
        { name: "Voice Studio Access", included: true },
        { name: "Advanced Content Remix", included: true },
        { name: "Real-time Trends Analysis", included: true },
        { name: "Viral Prediction Engine", included: true }
      ]
    },
    {
      category: "Professional Tools",
      icon: "🏢",
      items: [
        { name: "Brand Voice Consistency", included: true },
        { name: "Team Collaboration", included: true },
        { name: "Advanced Analytics Dashboard", included: true },
        { name: "Content Performance Tracking", included: true }
      ]
    },
    {
      category: "Premium Exclusives",
      icon: "💎",
      items: [
        { name: "Priority AI Processing", included: true },
        { name: "Custom Brand Templates", included: true },
        { name: "Advanced Export Options", included: true },
        { name: "24/7 Premium Support", included: true }
      ]
    }
  ];

  const stats = [
    { value: "300%", label: "Avg. Engagement Increase", icon: "📈" },
    { value: "10M+", label: "Posts Generated", icon: "📱" },
    { value: "50K+", label: "Active Creators", icon: "👥" },
    { value: "4.9/5", label: "User Rating", icon: "⭐" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      handle: "@sarahcreates",
      platform: "TikTok",
      followers: "2.3M",
      quote: "THREE11 transformed my content game completely. My engagement went from 10K to 300K+ consistently!",
      avatar: "👩‍💼"
    },
    {
      name: "Mike Chen",
      handle: "@mikescontent",
      platform: "Instagram",
      followers: "850K",
      quote: "The AI-powered features saved me 10+ hours per week while doubling my reach across all platforms.",
      avatar: "👨‍💻"
    },
    {
      name: "Emma Rodriguez",
      handle: "@emmatrends",
      platform: "YouTube",
      followers: "1.2M",
      quote: "Voice Studio and Content Remix are game-changers. My videos now consistently hit trending!",
      avatar: "👩‍🎨"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900">⭐ Premium</h1>
              <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold text-lg rounded-full">
                UNLOCK ALL
              </span>
            </div>
            <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your content creation with unlimited access to all THREE11 MOTION TECH features
            </p>
            
            {/* Competitive Pricing Plans */}
            <div className="max-w-6xl mx-auto mb-12">
              <div className="grid md:grid-cols-3 gap-8">
                
                {/* Basic Plan */}
                <div className="bg-white rounded-3xl shadow-lg p-8 border-2 border-gray-200">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic Plan</h3>
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      $9.99
                      <span className="text-lg text-gray-600 font-normal">/month</span>
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      <span className="line-through">$119.88</span> $99.99/year (Save $19.89!)
                    </div>
                    <p className="text-gray-600 mb-6">Perfect for individual creators and small businesses</p>
                    
                    <button className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-200">
                      Start Basic Plan
                    </button>
                    
                    <p className="text-xs text-gray-500 mt-3">7-day free trial • Cancel anytime</p>
                  </div>
                </div>

                {/* Unlimited Plan - POPULAR */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-gradient-to-r from-yellow-400 to-orange-400 transform scale-105">
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
                      MOST POPULAR
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Unlimited Plan</h3>
                    <div className="text-5xl font-bold text-orange-600 mb-2">
                      $29
                      <span className="text-2xl text-gray-600 font-normal">/month</span>
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      <span className="line-through">$348</span> $299/year (Save $49!)
                    </div>
                    <p className="text-gray-600 mb-6">Everything you need to dominate social media</p>
                    
                    <button className="w-full py-4 px-8 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-lg rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
                      Start Unlimited Now
                    </button>
                    
                    <p className="text-xs text-gray-500 mt-3">7-day free trial • Cancel anytime</p>
                  </div>
                </div>

                {/* Enterprise Plan */}
                <div className="bg-white rounded-3xl shadow-lg p-8 border-2 border-purple-200">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      $179.99
                      <span className="text-lg text-gray-600 font-normal">/year</span>
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      Team access codes • White label solutions
                    </div>
                    <p className="text-gray-600 mb-6">For teams and enterprise organizations</p>
                    
                    <button className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-200">
                      Start Enterprise Plan
                    </button>
                    
                    <p className="text-xs text-gray-500 mt-3">Custom integrations • Dedicated support</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Top Creators</h2>
            <p className="text-xl text-gray-600">See why creators choose THREE11 MOTION TECH Premium</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-4xl font-bold text-orange-600 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Everything You Need</h2>
            <p className="text-xl text-gray-600">Complete access to all THREE11 MOTION TECH tools and features</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {features.map((category, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-3xl">{category.icon}</span>
                  <h3 className="text-2xl font-bold text-gray-900">{category.category}</h3>
                </div>
                
                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center space-x-3">
                      <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-800 font-medium">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Creator Success Stories</h2>
            <p className="text-xl text-gray-600">See how THREE11 Premium transformed their content</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.handle}</p>
                    <p className="text-blue-600 text-sm font-medium">{testimonial.platform} • {testimonial.followers} followers</p>
                  </div>
                </div>
                <blockquote className="text-gray-800 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-yellow-500 to-orange-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Go Viral?</h2>
          <p className="text-xl text-yellow-100 mb-8">
            Join thousands of creators using THREE11 Premium to dominate social media
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="px-8 py-4 bg-white text-orange-600 font-bold text-lg rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
              Start 7-Day Free Trial
            </button>
            <Link 
              to="/generator"
              className="px-8 py-4 bg-transparent text-white font-bold text-lg rounded-xl border-2 border-white hover:bg-white hover:text-orange-600 transition-all duration-200"
            >
              Try Free Tools First
            </Link>
          </div>
          
          <div className="mt-8 flex justify-center items-center space-x-8 text-yellow-100">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>7-day free trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>No setup fees</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;