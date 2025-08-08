import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Sparkles, 
  Crown, 
  Users, 
  Zap, 
  Brain, 
  TrendingUp,
  Share2,
  Send,
  Database,
  Workflow,
  Calendar,
  Target,
  BarChart3,
  Settings,
  Play,
  CheckCircle,
  Star,
  Lightbulb,
  ArrowRight,
  BookOpen,
  Video,
  Mail,
  MessageSquareMore,
  UserCog,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  PlaySquare
} from 'lucide-react';

const GettingStartedGuide = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const phases = [
    {
      phase: 1,
      title: "Advanced AI Integration Hub",
      description: "Multi-AI content generation with THREE11 Creative AI, THREE11 Pro AI, THREE11 Smart AI, and THREE11 Research AI",
      features: ["AI Provider Selection", "Multi-Model Content Generation", "Optimized Performance"],
      status: "Complete",
      icon: <Brain className="h-5 w-5" />
    },
    {
      phase: 2,
      title: "Power User Features",
      description: "Batch operations, scheduling, templates, and advanced analytics",
      features: ["Batch Content Generation", "Content Scheduling", "Template Library", "Advanced Analytics"],
      status: "Complete",
      icon: <Zap className="h-5 w-5" />
    },
    {
      phase: 3,
      title: "Content Type Expansion",
      description: "Video, podcast, email, blog, and product content generation",
      features: ["Video Captions", "Podcast Descriptions", "Email Marketing", "Blog Posts", "Product Descriptions"],
      status: "Complete",
      icon: <Video className="h-5 w-5" />
    },
    {
      phase: 4,
      title: "Intelligence & Insights",
      description: "Performance tracking, predictions, A/B testing, and trend analysis",
      features: ["Performance Tracking", "Engagement Prediction", "A/B Testing", "Competitor Monitoring", "Trend Forecasting"],
      status: "Complete",
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      phase: 5,
      title: "Team Collaboration Platform",
      description: "Multi-user teams, role management, and collaboration workflows",
      features: ["Team Management", "Role-Based Permissions", "Collaboration Tools", "Approval Workflows"],
      status: "Complete",
      icon: <Users className="h-5 w-5" />
    },
    {
      phase: 6,
      title: "Social Media Automation",
      description: "Multi-platform publishing, CRM integration, and automation workflows",
      features: ["Social Publishing", "CRM Integration", "Automation Workflows", "Calendar Integration"],
      status: "Complete",
      icon: <Share2 className="h-5 w-5" />
    }
  ];

  const quickStartSteps = [
    {
      step: 1,
      title: "Generate Your First Content",
      description: "Start with the AI-powered content generator",
      icon: <Sparkles className="h-6 w-6" />,
      action: "Go to Generator",
      path: "/"
    },
    {
      step: 2,
      title: "Connect Social Accounts",
      description: "Link your Instagram, Facebook, Twitter, and LinkedIn",
      icon: <Share2 className="h-6 w-6" />,
      action: "Connect Accounts",
      path: "/social-dashboard"
    },
    {
      step: 3,
      title: "Set Up Automation",
      description: "Create workflows to automate your social media",
      icon: <Zap className="h-6 w-6" />,
      action: "Create Workflow",
      path: "/automation-workflows"
    },
    {
      step: 4,
      title: "Invite Your Team",
      description: "Add team members and set up collaboration",
      icon: <Users className="h-6 w-6" />,
      action: "Manage Team",
      path: "/team-management"
    }
  ];

  const features = [
    {
      category: "AI Content Generation",
      items: [
        { name: "Multi-AI Integration", description: "THREE11 Pro AI, THREE11 Creative AI, THREE11 Smart AI, THREE11 Research AI" },
        { name: "9 Content Categories", description: "Fashion, Tech, Food, Travel, Fitness, Beauty, Business, Lifestyle, Education" },
        { name: "4 Platform Optimization", description: "TikTok, Instagram, YouTube, Facebook" },
        { name: "Advanced Content Types", description: "Videos, Podcasts, Emails, Blogs, Product Descriptions" }
      ]
    },
    {
      category: "Social Media Automation",
      items: [
        { name: "Multi-Platform Publishing", description: "Publish to 7+ social platforms simultaneously" },
        { name: "Content Scheduling", description: "Advanced scheduling with optimal timing suggestions" },
        { name: "Automation Workflows", description: "Trigger-based actions and cross-platform campaigns" },
        { name: "Performance Analytics", description: "Comprehensive insights and engagement tracking" }
      ]
    },
    {
      category: "Team Collaboration",
      items: [
        { name: "Multi-User Teams", description: "Unlimited team members with role-based access" },
        { name: "Advanced Permissions", description: "30+ granular permissions for precise control" },
        { name: "Approval Workflows", description: "Content review and approval processes" },
        { name: "Real-Time Collaboration", description: "Comments, reviews, and team communication" }
      ]
    },
    {
      category: "Enterprise Features",
      items: [
        { name: "CRM Integration", description: "HubSpot, Salesforce, Pipedrive, Zoho, Monday, Airtable" },
        { name: "Calendar Integration", description: "Google Calendar, Outlook, Apple Calendar sync" },
        { name: "A/B Testing", description: "Test content variations and optimize performance" },
        { name: "Competitor Analysis", description: "Monitor and analyze competitor strategies" }
      ]
    }
  ];

  const platformIcons = {
    'instagram': <Instagram className="h-5 w-5 text-pink-500" />,
    'facebook': <Facebook className="h-5 w-5 text-blue-600" />,
    'twitter': <Twitter className="h-5 w-5 text-blue-400" />,
    'linkedin': <Linkedin className="h-5 w-5 text-blue-700" />,
    'tiktok': <PlaySquare className="h-5 w-5 text-black" />
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown className="h-8 w-8 text-yellow-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            THREE11 MOTION TECH
          </h1>
          <Sparkles className="h-8 w-8 text-blue-500" />
        </div>
        <p className="text-xl text-gray-600 mb-6">
          The Ultimate AI-Powered Social Media Automation Platform
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2">
            6 Phases Complete
          </Badge>
          <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2">
            Enterprise Ready
          </Badge>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2">
            50+ Features
          </Badge>
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2">
            Multi-Platform
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-5 lg:w-fit">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="quickstart" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Quick Start
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="phases" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Phases
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            User Guide
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Platform Overview */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-2xl">What is THREE11 MOTION TECH?</CardTitle>
              <CardDescription className="text-lg">
                A comprehensive, enterprise-level social media automation platform that transforms how you create, manage, and optimize content across all major social platforms.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">AI-Powered Content</h3>
                  <p className="text-sm text-gray-600">Generate high-quality content using multiple THREE11 AI models including Pro AI, Creative AI, Smart AI, and Research AI</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Automation Workflows</h3>
                  <p className="text-sm text-gray-600">Create sophisticated automation workflows with trigger-based actions and cross-platform publishing</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Team Collaboration</h3>
                  <p className="text-sm text-gray-600">Advanced team management with role-based permissions, approval workflows, and real-time collaboration</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">50+</div>
                <div className="text-sm text-gray-600">Features</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">75+</div>
                <div className="text-sm text-gray-600">API Endpoints</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">15+</div>
                <div className="text-sm text-gray-600">Integrations</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">7+</div>
                <div className="text-sm text-gray-600">Platforms</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quickstart" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Get Started in 4 Simple Steps</CardTitle>
              <CardDescription>
                Follow these steps to get the most out of your THREE11 MOTION TECH platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {quickStartSteps.map((step) => (
                  <div key={step.step} className="flex items-start gap-4 p-4 rounded-lg border">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                      <p className="text-gray-600 mb-3">{step.description}</p>
                      <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500">
                        {step.action}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                    <div className="text-blue-500">
                      {step.icon}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Platform Integration */}
          <Card>
            <CardHeader>
              <CardTitle>Supported Platforms & Integrations</CardTitle>
              <CardDescription>Connect with all major social media platforms and business tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Social Media Platforms</h4>
                  <div className="space-y-2">
                    {['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube', 'Pinterest'].map((platform) => (
                      <div key={platform} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{platform}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">CRM Integrations</h4>
                  <div className="space-y-2">
                    {['HubSpot', 'Salesforce', 'Pipedrive', 'Zoho CRM', 'Monday.com', 'Airtable'].map((crm) => (
                      <div key={crm} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{crm}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Calendar & Tools</h4>
                  <div className="space-y-2">
                    {['Google Calendar', 'Outlook', 'Apple Calendar', 'Calendly'].map((tool) => (
                      <div key={tool} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{tool}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          {features.map((category) => (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle>{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.items.map((item) => (
                    <div key={item.name} className="p-4 rounded-lg border">
                      <h4 className="font-semibold mb-2">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="phases" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Development Phases Overview</CardTitle>
              <CardDescription>
                The THREE11 MOTION TECH platform was built through 6 comprehensive phases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {phases.map((phase) => (
                  <div key={phase.phase} className="p-6 rounded-lg border bg-gradient-to-r from-gray-50 to-blue-50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {phase.phase}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{phase.title}</h3>
                          <p className="text-gray-600">{phase.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {phase.icon}
                        <Badge className="bg-green-100 text-green-800">
                          {phase.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {phase.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Creation Guide</CardTitle>
                <CardDescription>Master the art of AI-powered content generation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                    <div>
                      <p className="font-medium">Choose Your AI Provider</p>
                      <p className="text-sm text-gray-600">Select from THREE11 Pro AI, THREE11 Creative AI, THREE11 Smart AI, or THREE11 Research AI</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                    <div>
                      <p className="font-medium">Select Content Category</p>
                      <p className="text-sm text-gray-600">Pick from 9 specialized categories for optimal results</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                    <div>
                      <p className="font-medium">Choose Target Platform</p>
                      <p className="text-sm text-gray-600">Optimize for TikTok, Instagram, YouTube, or Facebook</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
                    <div>
                      <p className="font-medium">Generate & Refine</p>
                      <p className="text-sm text-gray-600">Create content and use remix features for variations</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automation Best Practices</CardTitle>
                <CardDescription>Set up effective automation workflows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Start Simple</p>
                      <p className="text-sm text-gray-600">Begin with basic scheduling workflows before advanced triggers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Monitor Performance</p>
                      <p className="text-sm text-gray-600">Use analytics to optimize workflow triggers and actions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Test Thoroughly</p>
                      <p className="text-sm text-gray-600">Use A/B testing to find the most effective automation strategies</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Maintain Balance</p>
                      <p className="text-sm text-gray-600">Mix automated and manual content for authentic engagement</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle>Pro Tips for Maximum Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-white">
                  <Target className="h-6 w-6 text-blue-500 mb-2" />
                  <h4 className="font-semibold mb-2">Use Competitor Analysis</h4>
                  <p className="text-sm text-gray-600">Monitor competitors to identify trending topics and optimal posting strategies</p>
                </div>
                <div className="p-4 rounded-lg bg-white">
                  <Calendar className="h-6 w-6 text-green-500 mb-2" />
                  <h4 className="font-semibold mb-2">Leverage Calendar Integration</h4>
                  <p className="text-sm text-gray-600">Sync with your calendar to align content with events and campaigns</p>
                </div>
                <div className="p-4 rounded-lg bg-white">
                  <Database className="h-6 w-6 text-purple-500 mb-2" />
                  <h4 className="font-semibold mb-2">Integrate CRM Data</h4>
                  <p className="text-sm text-gray-600">Use CRM insights to create targeted content for different audience segments</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Social Media?</h2>
        <p className="text-gray-600 mb-6">
          Join thousands of creators, businesses, and teams who are already using THREE11 MOTION TECH 
          to automate their social media success.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
            <Sparkles className="h-4 w-4 mr-2" />
            Start Creating Content
          </Button>
          <Button variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Invite Your Team
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Connect Social Accounts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GettingStartedGuide;