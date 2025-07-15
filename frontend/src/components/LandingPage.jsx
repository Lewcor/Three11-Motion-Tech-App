import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Sparkles, Zap, Crown, ArrowRight, Star, Users, TrendingUp, Brain } from 'lucide-react';
import { mockData } from '../mock';

const LandingPage = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full mb-8">
              <Sparkles className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Powered by THREE11 MOTION TECH
              </span>
              <Badge className="ml-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">
                AI-Powered
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-6">
              Complete Content Creation
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Suite for All Platforms
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
              From viral captions to video scripts, content ideas to trending topics - everything creators need for TikTok, Instagram, YouTube, and Facebook. 
              Powered by OpenAI GPT, Anthropic Claude, and Google Gemini working together.
            </p>
            
            <div className="flex items-center justify-center gap-8 text-sm text-slate-500 mb-8">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📱</span>
                <span>TikTok</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">📸</span>
                <span>Instagram</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">📺</span>
                <span>YouTube</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">👥</span>
                <span>Facebook</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/generator">
                <Button size="lg" className="group relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    Caption Generator
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Button>
              </Link>
              
              <Link to="/content-creation">
                <Button size="lg" variant="outline" className="group relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    <Brain className="mr-2 h-4 w-4" />
                    Content Suite
                    <Badge className="ml-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs">
                      NEW
                    </Badge>
                  </span>
                </Button>
              </Link>
              
              <Link to="/premium">
                <Button size="lg" variant="outline" className="group">
                  <Crown className="mr-2 h-4 w-4 text-amber-500" />
                  View Premium
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-8 text-sm text-slate-500 mb-16">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span>50K+ Creators</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>10M+ Posts Generated</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-500" />
                <span>7 Content Tools</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Providers Section */}
      <div className="py-16 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              THREE11 MOTION TECH
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              The world's first AI system that combines three leading AI providers for unmatched creativity
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockData.aiProviders.map((provider, index) => (
              <Card key={provider.id} className="group hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${provider.color} text-white text-2xl mx-auto mb-4`}>
                    {provider.icon}
                  </div>
                  <CardTitle className="text-xl">{provider.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-2">
                    {provider.id === 'openai' && (
                      <>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Creative & Engaging</p>
                        <div className="flex justify-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </>
                    )}
                    {provider.id === 'anthropic' && (
                      <>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Thoughtful & Nuanced</p>
                        <div className="flex justify-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </>
                    )}
                    {provider.id === 'gemini' && (
                      <>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Trendy & Current</p>
                        <div className="flex justify-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* New Content Creation Features Section */}
      <div className="py-16 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Complete Content Creation Suite
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Beyond captions - create complete content strategies with our revolutionary 7-tool suite
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500 text-white text-2xl mx-auto mb-4">
                  💡
                </div>
                <h3 className="font-semibold mb-2">Content Ideas</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Unlimited creative inspiration tailored to your niche
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500 text-white text-2xl mx-auto mb-4">
                  🎬
                </div>
                <h3 className="font-semibold mb-2">Video Scripts</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Complete scripts with hooks, content, and CTAs
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 text-white text-2xl mx-auto mb-4">
                  📈
                </div>
                <h3 className="font-semibold mb-2">Trending Topics</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Real-time trend analysis for viral content
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500 text-white text-2xl mx-auto mb-4">
                  📊
                </div>
                <h3 className="font-semibold mb-2">Strategy Planner</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Comprehensive content strategies for growth
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Platform Support Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Optimized for Every Platform
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Platform-specific optimization for maximum engagement across all major social networks
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black text-white text-2xl mx-auto mb-4">
                  📱
                </div>
                <h3 className="font-semibold mb-2">TikTok</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Short, trendy, viral content optimized for the For You Page
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl mx-auto mb-4">
                  📸
                </div>
                <h3 className="font-semibold mb-2">Instagram</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Visual storytelling with perfect captions and hashtags
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-600 text-white text-2xl mx-auto mb-4">
                  📺
                </div>
                <h3 className="font-semibold mb-2">YouTube</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Educational and entertaining content for discoverability
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white text-2xl mx-auto mb-4">
                  👥
                </div>
                <h3 className="font-semibold mb-2">Facebook</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Community-focused content that sparks conversations
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Content Categories Section */}
      <div className="py-16 bg-gradient-to-r from-slate-50 to-purple-50 dark:from-slate-800 dark:to-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              9 Specialized Content Categories
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              From fashion to event spaces - specialized content for every creator niche
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {mockData.contentCategories.map((category, index) => (
              <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${category.color} text-white text-2xl mx-auto mb-4`}>
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {category.name}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Why THREE11 MOTION TECH Dominates the Market
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Revolutionary features that no competitor can match
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Brain className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Triple AI Power</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  First-ever platform combining OpenAI, Anthropic, and Google Gemini for unmatched creativity
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <Badge variant="outline" className="text-xs">OpenAI GPT</Badge>
                  <Badge variant="outline" className="text-xs">Claude</Badge>
                  <Badge variant="outline" className="text-xs">Gemini</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Zap className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">7-Tool Content Suite</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Complete content creation workflow from ideas to strategy planning
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <Badge variant="outline" className="text-xs">Ideas</Badge>
                  <Badge variant="outline" className="text-xs">Scripts</Badge>
                  <Badge variant="outline" className="text-xs">Strategy</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <TrendingUp className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">4-Platform Optimization</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Specialized optimization for TikTok, Instagram, YouTube, and Facebook algorithms
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <Badge variant="outline" className="text-xs">📱 TikTok</Badge>
                  <Badge variant="outline" className="text-xs">📸 Instagram</Badge>
                  <Badge variant="outline" className="text-xs">📺 YouTube</Badge>
                  <Badge variant="outline" className="text-xs">👥 Facebook</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Unique Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Exclusive Features Nobody Else Has
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Revolutionary capabilities that set us apart from every competitor
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500 text-white text-2xl flex-shrink-0">
                    🏛️
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Event Space Category</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      First and only platform with specialized content for event venues, wedding halls, and corporate spaces
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">Wedding Venues</Badge>
                      <Badge variant="secondary" className="text-xs">Corporate Events</Badge>
                      <Badge variant="secondary" className="text-xs">Party Spaces</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500 text-white text-2xl flex-shrink-0">
                    🎯
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Real-Time Trend Analysis</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      AI-powered trend detection that keeps your content ahead of the curve on all platforms
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">Viral Trends</Badge>
                      <Badge variant="secondary" className="text-xs">Hashtag Analysis</Badge>
                      <Badge variant="secondary" className="text-xs">Auto-Updates</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white text-2xl flex-shrink-0">
                    📝
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Complete Video Scripts</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      Full video scripts with hooks, timestamps, and CTAs - not just captions
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">Hooks</Badge>
                      <Badge variant="secondary" className="text-xs">Timestamps</Badge>
                      <Badge variant="secondary" className="text-xs">CTAs</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500 text-white text-2xl flex-shrink-0">
                    📊
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Content Strategy Planner</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      Comprehensive content strategies with posting schedules and performance optimization
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">Weekly Plans</Badge>
                      <Badge variant="secondary" className="text-xs">Best Times</Badge>
                      <Badge variant="secondary" className="text-xs">Analytics</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Dominate All Platforms?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators using THREE11 MOTION TECH to create viral content for TikTok, Instagram, YouTube, and Facebook
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/generator">
              <Button size="lg" variant="secondary" className="group">
                Start Creating Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/content-creation">
              <Button size="lg" variant="outline" className="group text-white border-white hover:bg-white hover:text-blue-600">
                <Brain className="mr-2 h-4 w-4" />
                Explore Content Suite
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-8 text-sm opacity-75">
            <span>✨ 9 Content Categories</span>
            <span>🤖 3 AI Providers</span>
            <span>📱 4 Platforms</span>
            <span>🎨 7 Creation Tools</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;