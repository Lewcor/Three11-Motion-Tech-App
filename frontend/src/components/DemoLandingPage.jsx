import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sparkles, Crown, Zap, ArrowRight, Play, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const DemoLandingPage = () => {
  const [isDemoActive, setIsDemoActive] = useState(false);

  const startDemo = () => {
    // Set demo user in localStorage to bypass authentication
    const demoUser = {
      id: 'demo-user-12345',
      name: 'Demo User',
      email: 'demo@three11motion.com',
      subscription: 'demo',
      daily_generations_used: 0,
      daily_generation_limit: 5, // Limited demo
      created_at: new Date().toISOString()
    };
    
    const demoToken = 'demo-token-12345';
    
    localStorage.setItem('authToken', demoToken);
    localStorage.setItem('user', JSON.stringify(demoUser));
    localStorage.setItem('isDemoMode', 'true');
    
    setIsDemoActive(true);
    
    // Redirect to generator after brief delay
    setTimeout(() => {
      window.location.href = '/generator';
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">THREE11 MOTION TECH</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Revolutionary AI-Powered<br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Content Creation Platform
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              World's first AI competitor analysis + Multi-AI content generation + Voice studio + Real-time trends
            </p>
            
            {/* Demo CTA */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <Button
                onClick={startDemo}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold shadow-xl"
                disabled={isDemoActive}
              >
                {isDemoActive ? (
                  <>
                    <Zap className="mr-2 h-5 w-5 animate-spin" />
                    Starting Demo...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    Try FREE Demo Now!
                  </>
                )}
              </Button>
              
              <Link to="/auth">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg"
                >
                  <Crown className="mr-2 h-5 w-5" />
                  Get Full Access
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-8 text-sm opacity-75">
              <span>✨ No Credit Card Required</span>
              <span>🚀 5 Free Generations</span>
              <span>🎯 Full Feature Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Showcase */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Revolutionary Features You'll Experience
            </h2>
            <p className="text-xl text-gray-600">
              First-to-market capabilities that will transform your content creation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Competitor Analysis */}
            <Card className="hover:shadow-xl transition-all duration-300 border-2 border-purple-200">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-600 text-white mb-4">
                  🎯
                </div>
                <CardTitle className="text-xl">AI Competitor Analysis</CardTitle>
                <Badge className="w-fit bg-red-500">WORLD'S FIRST</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Analyze competitors, generate superior content, and identify strategic gaps they're missing.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">Strategy Analysis</Badge>
                  <Badge variant="outline">Content Generation</Badge>
                  <Badge variant="outline">Gap Analysis</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Multi-AI Generation */}
            <Card className="hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white mb-4">
                  🧠
                </div>
                <CardTitle className="text-xl">Triple AI Power</CardTitle>
                <Badge className="w-fit bg-blue-500">MULTI-AI</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Group 1 (Creative), Group 2 (Thoughtful), Group 3 (Trendy) working together for superior content.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">9 Categories</Badge>
                  <Badge variant="outline">4 Platforms</Badge>
                  <Badge variant="outline">AI Synthesis</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Voice Studio */}
            <Card className="hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-600 text-white mb-4">
                  🎙️
                </div>
                <CardTitle className="text-xl">Voice Studio</CardTitle>
                <Badge className="w-fit bg-green-500">AI VOICE</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Speak your ideas and get instant AI-optimized content for all social media platforms.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">Voice-to-Content</Badge>
                  <Badge variant="outline">Real-time</Badge>
                  <Badge variant="outline">Commands</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Trends Analyzer */}
            <Card className="hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-600 text-white mb-4">
                  📊
                </div>
                <CardTitle className="text-xl">Real-Time Trends</CardTitle>
                <Badge className="w-fit bg-orange-500">LIVE DATA</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  AI-powered trend analysis with predictions and content generation from trending topics.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">Trend Tracking</Badge>
                  <Badge variant="outline">Predictions</Badge>
                  <Badge variant="outline">Content Gen</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Content Remix */}
            <Card className="hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white mb-4">
                  🔄
                </div>
                <CardTitle className="text-xl">Content Remix Engine</CardTitle>
                <Badge className="w-fit bg-indigo-500">CROSS-PLATFORM</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Transform content across TikTok, Instagram, YouTube, and Facebook with AI optimization.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">Platform Adapt</Badge>
                  <Badge variant="outline">AI Variations</Badge>
                  <Badge variant="outline">Optimization</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Premium Features */}
            <Card className="hover:shadow-xl transition-all duration-300 border-2 border-yellow-200">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-600 text-white mb-4">
                  👑
                </div>
                <CardTitle className="text-xl">Premium Suite</CardTitle>
                <Badge className="w-fit bg-yellow-500">UNLIMITED</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Unlimited generations, advanced analytics, premium categories, and priority AI processing.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">$9.99/month</Badge>
                  <Badge variant="outline">Unlimited</Badge>
                  <Badge variant="outline">Analytics</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Join Thousands of Creators Already Using THREE11 MOTION TECH
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">50,000+</div>
              <div className="text-gray-600">Content Pieces Generated</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Active Creators</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-green-600 mb-2">4.9★</div>
              <div className="text-gray-600">User Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Revolutionize Your Content Creation?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Experience the world's most advanced AI-powered content creation platform
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              onClick={startDemo}
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              disabled={isDemoActive}
            >
              {isDemoActive ? (
                <>
                  <Zap className="mr-2 h-5 w-5 animate-spin" />
                  Starting Demo...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Start Free Demo
                </>
              )}
            </Button>
            
            <Link to="/premium">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg"
              >
                <Crown className="mr-2 h-5 w-5" />
                View Premium Plans
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 text-sm opacity-75">
            No credit card required • 5 free generations • Full feature access
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoLandingPage;