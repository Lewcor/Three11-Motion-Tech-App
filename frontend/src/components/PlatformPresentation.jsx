import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Crown, 
  Sparkles, 
  Brain, 
  Users, 
  Zap, 
  TrendingUp,
  Share2,
  Database,
  Calendar,
  Target,
  BarChart3,
  Settings,
  Play,
  ChevronLeft,
  ChevronRight,
  Star,
  Lightbulb,
  Rocket,
  Trophy,
  Globe,
  Smartphone,
  Shield,
  Infinity,
  CheckCircle2,
  ArrowRight,
  PlayCircle,
  PresentationChart,
  Mic,
  Video,
  Mail,
  FileText,
  Package,
  Eye,
  TestTube,
  MessageSquareMore,
  Workflow,
  Headphones
} from 'lucide-react';

const PlatformPresentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      type: 'title',
      title: 'THREE11 MOTION TECH',
      subtitle: 'The Ultimate AI-Powered Social Media Automation Platform',
      description: 'Enterprise-Level Solution for Content Creation, Team Collaboration & Multi-Platform Automation',
      badge: '6 Phases Complete',
      gradient: 'from-blue-600 via-purple-600 to-pink-600'
    },
    {
      id: 2,
      type: 'stats',
      title: 'Platform by the Numbers',
      stats: [
        { number: '50+', label: 'Features', icon: Star, color: 'text-blue-600' },
        { number: '75+', label: 'API Endpoints', icon: Globe, color: 'text-green-600' },
        { number: '15+', label: 'Integrations', icon: Settings, color: 'text-purple-600' },
        { number: '7+', label: 'Platforms', icon: Share2, color: 'text-orange-600' },
        { number: '4', label: 'AI Models', icon: Brain, color: 'text-pink-600' },
        { number: '9', label: 'Content Categories', icon: Target, color: 'text-cyan-600' }
      ]
    },
    {
      id: 3,
      type: 'ai-models',
      title: 'Powered by Advanced AI',
      description: 'Four cutting-edge AI models working together to create exceptional content',
      models: [
        {
          name: 'THREE11 Pro AI',
          description: 'Advanced multimodal AI with vision, coding, and reasoning capabilities',
          strengths: ['Creative writing', 'Technical content', 'Multimodal processing'],
          icon: Brain,
          color: 'bg-green-500'
        },
        {
          name: 'THREE11 Creative AI',
          description: 'Most intelligent AI model with superior reasoning and writing quality',
          strengths: ['Analysis', 'Writing quality', 'Complex reasoning'],
          icon: Sparkles,
          color: 'bg-orange-500'
        },
        {
          name: 'THREE11 Smart AI',
          description: 'Fastest multimodal model with real-time processing capabilities',
          strengths: ['Speed', 'Multimodal', 'Real-time processing'],
          icon: Zap,
          color: 'bg-blue-500'
        },
        {
          name: 'THREE11 Research AI',
          description: 'Real-time web search AI with current information and trend analysis',
          strengths: ['Current events', 'Trend analysis', 'Real-time data'],
          icon: TrendingUp,
          color: 'bg-purple-500'
        }
      ]
    },
    {
      id: 4,
      type: 'phases-overview',
      title: 'Development Journey: 6 Comprehensive Phases',
      phases: [
        {
          phase: 1,
          title: 'Advanced AI Integration Hub',
          description: 'Multi-AI content generation with advanced provider selection',
          icon: Brain,
          features: ['AI Provider Selection', 'Multi-Model Generation', 'Optimized Performance'],
          status: 'Complete'
        },
        {
          phase: 2,
          title: 'Power User Features',
          description: 'Batch operations, scheduling, templates, and advanced analytics',
          icon: Zap,
          features: ['Batch Generation', 'Content Scheduling', 'Template Library', 'Advanced Analytics'],
          status: 'Complete'
        },
        {
          phase: 3,
          title: 'Content Type Expansion',
          description: 'Video, podcast, email, blog, and product content generation',
          icon: Video,
          features: ['Video Captions', 'Podcast Descriptions', 'Email Marketing', 'Blog Posts'],
          status: 'Complete'
        },
        {
          phase: 4,
          title: 'Intelligence & Insights',
          description: 'Performance tracking, predictions, A/B testing, and trend analysis',
          icon: BarChart3,
          features: ['Performance Tracking', 'Engagement Prediction', 'A/B Testing', 'Trend Forecasting'],
          status: 'Complete'
        },
        {
          phase: 5,
          title: 'Team Collaboration Platform',
          description: 'Multi-user teams, role management, and collaboration workflows',
          icon: Users,
          features: ['Team Management', 'Role Permissions', 'Collaboration Tools', 'Approval Workflows'],
          status: 'Complete'
        },
        {
          phase: 6,
          title: 'Social Media Automation',
          description: 'Multi-platform publishing, CRM integration, and automation workflows',
          icon: Share2,
          features: ['Social Publishing', 'CRM Integration', 'Automation Workflows', 'Calendar Integration'],
          status: 'Complete'
        }
      ]
    },
    {
      id: 5,
      type: 'features-showcase',
      title: 'Feature Categories',
      categories: [
        {
          title: 'AI Content Generation',
          icon: Brain,
          color: 'bg-blue-500',
          features: [
            { name: 'Multi-AI Integration', desc: 'Four advanced AI models' },
            { name: '9 Content Categories', desc: 'Fashion, Tech, Food, Travel, etc.' },
            { name: '4 Platform Optimization', desc: 'TikTok, Instagram, YouTube, Facebook' },
            { name: 'Voice Processing', desc: 'Voice-to-content generation' }
          ]
        },
        {
          title: 'Social Media Automation',
          icon: Share2,
          color: 'bg-green-500',
          features: [
            { name: 'Multi-Platform Publishing', desc: '7+ social platforms' },
            { name: 'Content Scheduling', desc: 'Advanced scheduling system' },
            { name: 'Automation Workflows', desc: 'Trigger-based automation' },
            { name: 'Performance Analytics', desc: 'Comprehensive insights' }
          ]
        },
        {
          title: 'Team Collaboration',
          icon: Users,
          color: 'bg-purple-500',
          features: [
            { name: 'Multi-User Teams', desc: 'Unlimited team members' },
            { name: 'Advanced Permissions', desc: '30+ granular permissions' },
            { name: 'Approval Workflows', desc: 'Content review processes' },
            { name: 'Real-Time Collaboration', desc: 'Comments and reviews' }
          ]
        },
        {
          title: 'Enterprise Features',
          icon: Crown,
          color: 'bg-orange-500',
          features: [
            { name: 'CRM Integration', desc: 'HubSpot, Salesforce, Pipedrive' },
            { name: 'Calendar Integration', desc: 'Google, Outlook, Apple' },
            { name: 'A/B Testing', desc: 'Content optimization' },
            { name: 'Competitor Analysis', desc: 'Market intelligence' }
          ]
        }
      ]
    },
    {
      id: 6,
      type: 'platform-benefits',
      title: 'Why Choose THREE11 MOTION TECH?',
      benefits: [
        {
          icon: Rocket,
          title: 'Boost Productivity',
          description: 'Automate content creation and save 10+ hours per week',
          metric: '90% Time Saved'
        },
        {
          icon: TrendingUp,
          title: 'Increase Engagement',
          description: 'AI-optimized content that drives higher engagement rates',
          metric: '300% Better Results'
        },
        {
          icon: Users,
          title: 'Scale Your Team',
          description: 'Collaborate seamlessly with unlimited team members',
          metric: 'Unlimited Growth'
        },
        {
          icon: Globe,
          title: 'Multi-Platform Reach',
          description: 'Publish to all major social media platforms simultaneously',
          metric: '7+ Platforms'
        },
        {
          icon: Brain,
          title: 'AI-Powered Intelligence',
          description: 'Leverage cutting-edge AI for superior content quality',
          metric: '4 AI Models'
        },
        {
          icon: Shield,
          title: 'Enterprise Security',
          description: 'Bank-level security with advanced permissions system',
          metric: '100% Secure'
        }
      ]
    },
    {
      id: 7,
      type: 'use-cases',
      title: 'Perfect for Every Use Case',
      cases: [
        {
          title: 'Content Creators',
          icon: Sparkles,
          description: 'Generate viral content across multiple platforms with AI assistance',
          features: ['Multi-platform content', 'Trend analysis', 'Engagement optimization', 'Voice processing']
        },
        {
          title: 'Marketing Agencies',
          icon: Target,
          description: 'Manage multiple client accounts with team collaboration tools',
          features: ['Client management', 'Team workflows', 'Brand guidelines', 'Performance tracking']
        },
        {
          title: 'E-commerce Brands',
          icon: Package,
          description: 'Create product descriptions, marketing campaigns, and social content',
          features: ['Product descriptions', 'Email marketing', 'CRM integration', 'Sales automation']
        },
        {
          title: 'Enterprise Teams',
          icon: Users,
          description: 'Large-scale content operations with advanced permissions',
          features: ['Role management', 'Approval workflows', 'Enterprise integrations', 'Advanced analytics']
        }
      ]
    },
    {
      id: 8,
      type: 'demo-cta',
      title: 'Ready to Transform Your Social Media?',
      description: 'Join thousands of creators, businesses, and teams who are already using THREE11 MOTION TECH to automate their social media success.',
      features: [
        'Start creating content immediately',
        'Access all 50+ features',
        'Connect your social accounts',
        'Invite your team members',
        'Set up automation workflows'
      ]
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const currentSlideData = slides[currentSlide];

  const renderSlide = () => {
    const slide = currentSlideData;

    switch (slide.type) {
      case 'title':
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge className="px-6 py-3 text-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {slide.badge}
              </Badge>
              <h1 className={`text-6xl font-bold bg-gradient-to-r ${slide.gradient} bg-clip-text text-transparent`}>
                {slide.title}
              </h1>
              <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
                {slide.subtitle}
              </p>
              <p className="text-lg text-gray-500 max-w-3xl mx-auto">
                {slide.description}
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg px-8 py-4">
                <PlayCircle className="h-6 w-6 mr-2" />
                Start Presentation
              </Button>
            </div>
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
              <p className="text-xl text-gray-600">Impressive numbers that showcase our platform's capabilities</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {slide.stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow">
                    <CardContent className="space-y-4">
                      <IconComponent className={`h-12 w-12 mx-auto ${stat.color}`} />
                      <div className="text-4xl font-bold text-gray-900">{stat.number}</div>
                      <div className="text-lg text-gray-600">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 'ai-models':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">{slide.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {slide.models.map((model, index) => {
                const IconComponent = model.icon;
                return (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${model.color} rounded-full flex items-center justify-center`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl">{model.name}</CardTitle>
                      </div>
                      <CardDescription className="text-base">{model.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-gray-700">Key Strengths:</h4>
                        <div className="flex flex-wrap gap-2">
                          {model.strengths.map((strength, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 'phases-overview':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
              <p className="text-xl text-gray-600">Six comprehensive phases of development completed</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {slide.phases.map((phase, index) => {
                const IconComponent = phase.icon;
                return (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {phase.phase}
                          </div>
                          <IconComponent className="h-6 w-6 text-blue-500" />
                        </div>
                        <Badge className="bg-green-100 text-green-800">{phase.status}</Badge>
                      </div>
                      <CardTitle className="text-lg">{phase.title}</CardTitle>
                      <CardDescription>{phase.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {phase.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 'features-showcase':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
              <p className="text-xl text-gray-600">Comprehensive feature sets across all major categories</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {slide.categories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Card key={index} className="p-6">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl">{category.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {category.features.map((feature, idx) => (
                          <div key={idx} className="border-l-4 border-gray-200 pl-4">
                            <h4 className="font-semibold text-sm">{feature.name}</h4>
                            <p className="text-sm text-gray-600">{feature.desc}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 'platform-benefits':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
              <p className="text-xl text-gray-600">Measurable benefits that transform your social media strategy</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {slide.benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                    <CardContent className="space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                      <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                        {benefit.metric}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 'use-cases':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
              <p className="text-xl text-gray-600">Designed to meet the needs of diverse user types</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {slide.cases.map((useCase, index) => {
                const IconComponent = useCase.icon;
                return (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl">{useCase.title}</CardTitle>
                      </div>
                      <CardDescription className="text-base">{useCase.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        {useCase.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 'demo-cta':
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {slide.title}
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                {slide.description}
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg max-w-3xl mx-auto">
              <h3 className="text-2xl font-semibold mb-6">Get Started in Minutes:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {slide.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg px-8 py-4">
                <Sparkles className="h-6 w-6 mr-2" />
                Start Creating Content
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                <Users className="h-6 w-6 mr-2" />
                Invite Your Team
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                <Share2 className="h-6 w-6 mr-2" />
                Connect Social Accounts
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Crown className="h-8 w-8 text-yellow-500" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                THREE11 MOTION TECH Presentation
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Slide {currentSlide + 1} of {slides.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="min-h-[600px]">
          {renderSlide()}
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={prevSlide}
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide 
                      ? 'bg-blue-500' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <Button 
              variant="outline" 
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformPresentation;