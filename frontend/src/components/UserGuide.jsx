import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  BookOpen,
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
  CheckCircle,
  Star,
  Lightbulb,
  ArrowRight,
  Video,
  Mail,
  FileText,
  Package,
  Eye,
  TestTube,
  MessageSquareMore,
  Workflow,
  Headphones,
  Mic,
  Search,
  Upload,
  Download,
  Copy,
  Edit,
  Trash2,
  Plus,
  Filter,
  SortAsc,
  Calendar as CalendarIcon,
  Clock,
  Bell,
  Shield,
  Key,
  Globe,
  Smartphone,
  Monitor,
  Palette,
  Code,
  GitBranch,
  Layers,
  MousePointer,
  Keyboard,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Info,
  Award,
  Rocket,
  Trophy
} from 'lucide-react';

const UserGuide = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const guideStructure = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Rocket,
      sections: [
        { id: 'quick-start', title: 'Quick Start Guide', icon: Play },
        { id: 'first-content', title: 'Creating Your First Content', icon: Sparkles },
        { id: 'account-setup', title: 'Account Setup', icon: Settings },
        { id: 'navigation', title: 'Platform Navigation', icon: MousePointer }
      ]
    },
    {
      id: 'ai-content',
      title: 'AI Content Generation',
      icon: Brain,
      sections: [
        { id: 'ai-providers', title: 'AI Provider Selection', icon: Star },
        { id: 'content-categories', title: 'Content Categories', icon: Target },
        { id: 'platform-optimization', title: 'Platform Optimization', icon: Share2 },
        { id: 'advanced-prompting', title: 'Advanced Prompting', icon: Code }
      ]
    },
    {
      id: 'power-features',
      title: 'Power User Features',
      icon: Zap,
      sections: [
        { id: 'batch-generation', title: 'Batch Content Generation', icon: Layers },
        { id: 'content-scheduling', title: 'Content Scheduling', icon: Calendar },
        { id: 'template-library', title: 'Template Library', icon: FileText },
        { id: 'advanced-analytics', title: 'Advanced Analytics', icon: BarChart3 }
      ]
    },
    {
      id: 'content-types',
      title: 'Content Types',
      icon: Video,
      sections: [
        { id: 'video-content', title: 'Video Captions & Subtitles', icon: Video },
        { id: 'podcast-content', title: 'Podcast Descriptions', icon: Headphones },
        { id: 'email-marketing', title: 'Email Marketing', icon: Mail },
        { id: 'blog-posts', title: 'Blog Post Generation', icon: FileText },
        { id: 'product-descriptions', title: 'Product Descriptions', icon: Package }
      ]
    },
    {
      id: 'voice-features',
      title: 'Voice Processing',
      icon: Mic,
      sections: [
        { id: 'voice-transcription', title: 'Voice Transcription', icon: Mic },
        { id: 'voice-to-content', title: 'Voice-to-Content Suite', icon: ArrowRight },
        { id: 'voice-commands', title: 'Voice Commands', icon: Settings },
        { id: 'real-time-processing', title: 'Real-time Processing', icon: Clock }
      ]
    },
    {
      id: 'intelligence',
      title: 'Intelligence & Insights',
      icon: TrendingUp,
      sections: [
        { id: 'performance-tracking', title: 'Performance Tracking', icon: BarChart3 },
        { id: 'engagement-prediction', title: 'Engagement Prediction', icon: Eye },
        { id: 'ab-testing', title: 'A/B Testing', icon: TestTube },
        { id: 'competitor-monitoring', title: 'Competitor Monitoring', icon: Search },
        { id: 'trend-forecasting', title: 'Trend Forecasting', icon: TrendingUp }
      ]
    },
    {
      id: 'team-collaboration',
      title: 'Team Collaboration',
      icon: Users,
      sections: [
        { id: 'team-management', title: 'Team Management', icon: Users },
        { id: 'role-permissions', title: 'Role & Permissions', icon: Shield },
        { id: 'collaboration-tools', title: 'Collaboration Tools', icon: MessageSquareMore },
        { id: 'approval-workflows', title: 'Approval Workflows', icon: CheckCircle }
      ]
    },
    {
      id: 'social-automation',
      title: 'Social Media Automation',
      icon: Share2,
      sections: [
        { id: 'social-publishing', title: 'Social Media Publishing', icon: Share2 },
        { id: 'automation-workflows', title: 'Automation Workflows', icon: Workflow },
        { id: 'crm-integration', title: 'CRM Integration', icon: Database },
        { id: 'calendar-integration', title: 'Calendar Integration', icon: CalendarIcon }
      ]
    }
  ];

  const quickStartSteps = [
    {
      step: 1,
      title: 'Create Your Account',
      description: 'Sign up with your email and verify your account to get started.',
      details: [
        'Click "Get Started" in the top navigation',
        'Enter your email, name, and create a secure password',
        'Verify your email address',
        'Complete your profile setup'
      ],
      tip: 'Use a business email for better organization'
    },
    {
      step: 2,
      title: 'Choose Your AI Providers',
      description: 'Select from our four advanced AI models based on your needs.',
      details: [
        'Go to the Generator page',
        'View the AI Provider Selector section',
        'Toggle on your preferred AI models (1-4 providers)',
        'Use preset buttons for quick selection (Fast, Balanced, Maximum)'
      ],
      tip: 'Start with THREE11 Creative AI for best writing quality'
    },
    {
      step: 3,
      title: 'Generate Your First Content',
      description: 'Create your first piece of AI-powered social media content.',
      details: [
        'Select your content category (Fashion, Tech, Food, etc.)',
        'Choose your target platform (TikTok, Instagram, YouTube, Facebook)',
        'Enter a detailed description of your content',
        'Click "Generate Content" and watch the magic happen'
      ],
      tip: 'Be specific in your descriptions for better results'
    },
    {
      step: 4,
      title: 'Connect Social Accounts',
      description: 'Link your social media accounts for direct publishing.',
      details: [
        'Navigate to Social Media Dashboard',
        'Click "Connect Account" for each platform',
        'Authorize THREE11 MOTION TECH to access your accounts',
        'Verify successful connections'
      ],
      tip: 'Connect multiple accounts to maximize your reach'
    },
    {
      step: 5,
      title: 'Set Up Your Team',
      description: 'Invite team members and set up collaboration workflows.',
      details: [
        'Go to Team Management',
        'Click "Invite Members" and enter email addresses',
        'Assign appropriate roles and permissions',
        'Set up approval workflows if needed'
      ],
      tip: 'Use role-based permissions for better security'
    }
  ];

  const contentGuides = {
    'ai-providers': {
      title: 'AI Provider Selection Guide',
      description: 'Master the art of choosing the right AI model for your content',
      content: [
        {
          title: 'THREE11 Pro AI',
          description: 'Best for technical content, complex reasoning, and multimodal processing',
          useWhen: [
            'Creating technical tutorials or explanations',
            'Generating code-related content',
            'Complex problem-solving content',
            'Detailed product analysis'
          ],
          strengths: ['Creative writing', 'Technical content', 'Multimodal processing'],
          example: 'Perfect for creating detailed software reviews or technical how-to guides'
        },
        {
          title: 'THREE11 Creative AI',
          description: 'Superior for high-quality writing, analysis, and creative content',
          useWhen: [
            'Writing long-form content',
            'Creating compelling narratives',
            'Analytical and research content',
            'Professional communications'
          ],
          strengths: ['Analysis', 'Writing quality', 'Complex reasoning'],
          example: 'Ideal for brand storytelling, thought leadership articles, or detailed reviews'
        },
        {
          title: 'THREE11 Smart AI',
          description: 'Fastest processing for quick responses and real-time content',
          useWhen: [
            'Time-sensitive content creation',
            'Quick social media posts',
            'Real-time responses',
            'High-volume content generation'
          ],
          strengths: ['Speed', 'Multimodal', 'Real-time processing'],
          example: 'Great for trending topic responses or rapid content creation campaigns'
        },
        {
          title: 'THREE11 Research AI',
          description: 'Real-time web search for current events and trend analysis',
          useWhen: [
            'Current events commentary',
            'Trend-based content',
            'Market research insights',
            'News-related posts'
          ],
          strengths: ['Current events', 'Trend analysis', 'Real-time data'],
          example: 'Perfect for creating content about breaking news or current market trends'
        }
      ],
      tips: [
        'Use multiple AI providers for diverse perspectives',
        'Test different providers for your specific use case',
        'Combine providers for comprehensive content coverage',
        'Monitor performance to optimize provider selection'
      ]
    },
    'content-categories': {
      title: 'Content Categories Mastery',
      description: 'Learn how to leverage our 9 specialized content categories',
      content: [
        {
          title: 'Fashion',
          description: 'Style-focused content with trend awareness',
          bestFor: ['Outfit posts', 'Style tips', 'Fashion reviews', 'Trend predictions'],
          tips: ['Use seasonal references', 'Include style tips', 'Mention trending pieces', 'Add styling advice']
        },
        {
          title: 'Fitness',
          description: 'Motivational and educational fitness content',
          bestFor: ['Workout routines', 'Fitness tips', 'Progress updates', 'Motivation posts'],
          tips: ['Focus on motivation', 'Include actionable tips', 'Share progress stories', 'Emphasize health benefits']
        },
        {
          title: 'Food',
          description: 'Mouth-watering culinary content',
          bestFor: ['Recipe shares', 'Restaurant reviews', 'Food photography', 'Cooking tips'],
          tips: ['Make it appetizing', 'Include preparation tips', 'Share interesting facts', 'Add personal touches']
        },
        {
          title: 'Travel',
          description: 'Wanderlust-inspiring destination content',
          bestFor: ['Destination guides', 'Travel tips', 'Photo captions', 'Experience sharing'],
          tips: ['Inspire wanderlust', 'Include practical tips', 'Share personal experiences', 'Highlight unique aspects']
        },
        {
          title: 'Business',
          description: 'Professional and strategic business content',
          bestFor: ['Industry insights', 'Professional tips', 'Company updates', 'Thought leadership'],
          tips: ['Provide value', 'Share insights', 'Be professional yet engaging', 'Include actionable advice']
        },
        {
          title: 'Gaming',
          description: 'Engaging gaming community content',
          bestFor: ['Game reviews', 'Gaming tips', 'Community posts', 'Streaming content'],
          tips: ['Use gaming terminology', 'Engage with community', 'Share strategies', 'Be enthusiastic']
        },
        {
          title: 'Music',
          description: 'Emotionally resonant music content',
          bestFor: ['Song reviews', 'Artist features', 'Playlist shares', 'Music discovery'],
          tips: ['Connect emotionally', 'Share music stories', 'Include listening recommendations', 'Discuss impact']
        },
        {
          title: 'Ideas & Creativity',
          description: 'Inspiring creative and innovative content',
          bestFor: ['Creative inspiration', 'DIY projects', 'Innovative concepts', 'Artistic expression'],
          tips: ['Spark creativity', 'Share processes', 'Encourage experimentation', 'Inspire action']
        },
        {
          title: 'Event Space',
          description: 'Compelling venue and event content',
          bestFor: ['Venue promotion', 'Event highlights', 'Space features', 'Booking encouragement'],
          tips: ['Highlight unique features', 'Create atmosphere', 'Share success stories', 'Include booking details']
        }
      ]
    }
  };

  const troubleshootingGuide = [
    {
      issue: 'AI Providers Showing as Unavailable',
      solution: 'Check your internet connection and refresh the page. All AI providers should show as available.',
      details: ['Refresh your browser', 'Check network connection', 'Clear browser cache', 'Try different browser']
    },
    {
      issue: 'Content Generation Taking Too Long',
      solution: 'This usually happens during high traffic. Try using fewer AI providers or try again later.',
      details: ['Reduce number of selected AI providers', 'Try during off-peak hours', 'Check content description length', 'Use simpler prompts']
    },
    {
      issue: 'Unable to Connect Social Accounts',
      solution: 'Ensure you have admin access to your social accounts and allow pop-ups.',
      details: ['Enable pop-ups for this site', 'Check admin permissions', 'Try incognito mode', 'Clear cookies and try again']
    },
    {
      issue: 'Team Members Cannot Access Features',
      solution: 'Check their role permissions and ensure they have the right access level.',
      details: ['Review role assignments', 'Check permission settings', 'Verify email invitations', 'Confirm account activation']
    },
    {
      issue: 'Batch Generation Not Working',
      solution: 'Ensure you have proper permissions and check your content descriptions.',
      details: ['Verify user permissions', 'Check content format', 'Reduce batch size', 'Review error messages']
    }
  ];

  const faqs = [
    {
      question: 'How many AI providers can I use simultaneously?',
      answer: 'You can use 1-4 AI providers simultaneously. Using multiple providers gives you diverse perspectives and better content quality. We recommend starting with 2-3 providers for optimal results.'
    },
    {
      question: 'What makes THREE11 MOTION TECH different from other platforms?',
      answer: 'THREE11 MOTION TECH is the only platform that combines 4 advanced AI models, 50+ features, team collaboration, real-time trends, voice processing, and enterprise-level automation in one comprehensive solution.'
    },
    {
      question: 'Can I schedule content for multiple platforms at once?',
      answer: 'Yes! Our Social Media Publishing feature allows you to create content once and publish it across all your connected platforms simultaneously, with platform-specific optimizations.'
    },
    {
      question: 'How does the voice-to-content feature work?',
      answer: 'Simply record your voice or upload audio files. Our AI transcribes your speech and then generates optimized social media content based on what you said, saving you time and effort.'
    },
    {
      question: 'Is there a limit to team members?',
      answer: 'No, you can invite unlimited team members. Each member can have different roles and permissions based on your organizational needs.'
    },
    {
      question: 'How accurate is the engagement prediction?',
      answer: 'Our AI analyzes historical data, current trends, and content characteristics to provide engagement predictions. While not 100% accurate, our predictions help optimize your content strategy significantly.'
    },
    {
      question: 'Can I integrate with my existing CRM?',
      answer: 'Yes! We support integration with HubSpot, Salesforce, Pipedrive, Zoho CRM, Monday.com, and Airtable. This allows you to sync your social media efforts with your customer management.'
    },
    {
      question: 'What platforms can I publish to?',
      answer: 'You can publish to Instagram, Facebook, Twitter, LinkedIn, TikTok, YouTube, and Pinterest. We optimize content specifically for each platform\'s requirements and best practices.'
    }
  ];

  const bestPractices = [
    {
      category: 'Content Creation',
      icon: Sparkles,
      practices: [
        {
          title: 'Be Specific in Descriptions',
          description: 'The more detailed your content description, the better the AI can understand and create relevant content.',
          example: 'Instead of "fashion post", use "spring fashion trends for young professionals featuring pastel colors and minimalist accessories"'
        },
        {
          title: 'Use Multiple AI Providers',
          description: 'Different AI models excel at different types of content. Use 2-3 providers for diverse perspectives.',
          example: 'Use THREE11 Creative AI for storytelling and THREE11 Research AI for trending topics'
        },
        {
          title: 'Optimize for Each Platform',
          description: 'Each social platform has different audience expectations and content formats.',
          example: 'Instagram posts can be longer and more visual, while TikTok content should be punchy and trend-focused'
        }
      ]
    },
    {
      category: 'Team Collaboration',
      icon: Users,
      practices: [
        {
          title: 'Set Clear Roles and Permissions',
          description: 'Define who can create, edit, approve, and publish content to maintain quality and consistency.',
          example: 'Content creators can generate and edit, managers can approve, and admins can publish'
        },
        {
          title: 'Use Approval Workflows',
          description: 'Implement review processes for important content to ensure brand consistency.',
          example: 'All client content goes through: Creator → Manager → Client → Publisher'
        },
        {
          title: 'Collaborate in Real-Time',
          description: 'Use comments and reviews to provide feedback and iterate on content quickly.',
          example: 'Leave specific feedback on content sections and tag team members for quick responses'
        }
      ]
    },
    {
      category: 'Automation & Scheduling',
      icon: Workflow,
      practices: [
        {
          title: 'Plan Your Content Calendar',
          description: 'Use our scheduling features to maintain consistent posting across all platforms.',
          example: 'Schedule posts for optimal engagement times: 9 AM for LinkedIn, 7 PM for Instagram'
        },
        {
          title: 'Set Up Smart Workflows',
          description: 'Create automation rules that trigger based on performance, timing, or content type.',
          example: 'Auto-repost high-performing content after 48 hours to different platforms'
        },
        {
          title: 'Monitor and Adjust',
          description: 'Use analytics to continuously improve your automation strategies.',
          example: 'If engagement drops on Tuesdays, adjust your posting schedule automatically'
        }
      ]
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Getting Started with THREE11 MOTION TECH</h2>
              <p className="text-lg text-gray-600 mb-8">
                Welcome to the ultimate AI-powered social media automation platform! Follow this comprehensive guide to master all features and become a content creation expert.
              </p>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-6 w-6 text-blue-500" />
                  Quick Start Guide
                </CardTitle>
                <CardDescription>Get up and running in 5 simple steps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {quickStartSteps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2">{step.title}</h4>
                        <p className="text-gray-600 mb-3">{step.description}</p>
                        <div className="bg-gray-50 p-3 rounded-lg mb-2">
                          <h5 className="font-medium text-sm mb-2">Detailed Steps:</h5>
                          <ul className="text-sm space-y-1">
                            {step.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <strong className="text-blue-700 text-sm">Pro Tip: </strong>
                              <span className="text-blue-600 text-sm">{step.tip}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MousePointer className="h-5 w-5 text-green-500" />
                    Platform Navigation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium">Desktop Navigation</h4>
                      <p className="text-sm text-gray-600">All features accessible from the top navigation bar with organized sections and badges.</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Mobile Navigation</h4>
                      <p className="text-sm text-gray-600">Responsive design with collapsible menu for easy access on mobile devices.</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Feature Badges</h4>
                      <p className="text-sm text-gray-600">Color-coded badges help identify feature categories (NEW, BETA, PRO, etc.).</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-purple-500" />
                    Account Setup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium">Profile Configuration</h4>
                      <p className="text-sm text-gray-600">Complete your profile with business information and preferences.</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Integration Setup</h4>
                      <p className="text-sm text-gray-600">Connect social media accounts, CRM systems, and calendar applications.</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Team Onboarding</h4>
                      <p className="text-sm text-gray-600">Invite team members and set up collaboration workflows.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'ai-content':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">AI Content Generation Mastery</h2>
              <p className="text-lg text-gray-600 mb-8">
                Learn how to leverage our four advanced AI models and create exceptional content across all categories and platforms.
              </p>
            </div>

            {Object.entries(contentGuides).map(([key, guide]) => (
              <Card key={key} className="mb-6">
                <CardHeader>
                  <CardTitle>{guide.title}</CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {key === 'ai-providers' && (
                    <div className="grid md:grid-cols-2 gap-6">
                      {guide.content.map((provider, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-semibold text-lg mb-2 text-blue-600">{provider.title}</h4>
                          <p className="text-gray-600 mb-3">{provider.description}</p>
                          
                          <div className="space-y-3">
                            <div>
                              <h5 className="font-medium text-sm mb-1">Use When:</h5>
                              <ul className="text-sm space-y-1">
                                {provider.useWhen.map((use, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <ArrowRight className="h-3 w-3 text-gray-400 mt-1 flex-shrink-0" />
                                    <span>{use}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h5 className="font-medium text-sm mb-1">Key Strengths:</h5>
                              <div className="flex flex-wrap gap-1">
                                {provider.strengths.map((strength, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {strength}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <h5 className="font-medium text-sm mb-1">Example Use Case:</h5>
                              <p className="text-sm text-blue-700">{provider.example}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {key === 'content-categories' && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {guide.content.map((category, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2">{category.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                          
                          <div className="space-y-2">
                            <div>
                              <h5 className="font-medium text-xs mb-1">Best For:</h5>
                              <ul className="text-xs space-y-1">
                                {category.bestFor.map((item, idx) => (
                                  <li key={idx} className="flex items-center gap-1">
                                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h5 className="font-medium text-xs mb-1">Pro Tips:</h5>
                              <ul className="text-xs space-y-1">
                                {category.tips.map((tip, idx) => (
                                  <li key={idx} className="flex items-start gap-1">
                                    <Lightbulb className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {guide.tips && (
                    <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        Expert Tips
                      </h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {guide.tips.map((tip, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Section Coming Soon</h3>
            <p className="text-gray-600">This section is being developed. Please check other sections for now.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <BookOpen className="h-8 w-8 text-blue-500" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                THREE11 MOTION TECH User Guide
              </h1>
              <p className="text-gray-600">Complete guide to mastering your AI-powered social media platform</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-4 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Guide Sections</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <nav className="space-y-2">
                    {guideStructure.map((section) => {
                      const IconComponent = section.icon;
                      return (
                        <div key={section.id}>
                          <button
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                              activeSection === section.id
                                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            <IconComponent className="h-5 w-5" />
                            <span className="font-medium">{section.title}</span>
                          </button>
                          {activeSection === section.id && section.sections && (
                            <div className="ml-8 mt-2 space-y-1">
                              {section.sections.map((subsection) => {
                                const SubIconComponent = subsection.icon;
                                return (
                                  <button
                                    key={subsection.id}
                                    className="w-full flex items-center gap-2 px-2 py-1 text-sm text-gray-600 hover:text-gray-900 rounded transition-colors"
                                  >
                                    <SubIconComponent className="h-4 w-4" />
                                    <span>{subsection.title}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>

              {/* Quick Access */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Quick Access</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    FAQ
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Troubleshooting
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Award className="h-4 w-4 mr-2" />
                    Best Practices
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Video Tutorials
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {renderContent()}
            </div>

            {/* FAQ Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-6 w-6 text-blue-500" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border rounded-lg">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg"
                      >
                        <span className="font-medium">{faq.question}</span>
                        {expandedFaq === index ? (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                      {expandedFaq === index && (
                        <div className="px-4 pb-4">
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Best Practices */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-yellow-500" />
                  Best Practices
                </CardTitle>
                <CardDescription>Expert tips to maximize your results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {bestPractices.map((category, index) => {
                    const IconComponent = category.icon;
                    return (
                      <div key={index}>
                        <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                          <IconComponent className="h-5 w-5 text-blue-500" />
                          {category.category}
                        </h3>
                        <div className="space-y-4">
                          {category.practices.map((practice, idx) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium mb-2">{practice.title}</h4>
                              <p className="text-gray-600 mb-3">{practice.description}</p>
                              <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                                <strong className="text-sm text-blue-700">Example: </strong>
                                <span className="text-sm">{practice.example}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Troubleshooting */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-orange-500" />
                  Troubleshooting Guide
                </CardTitle>
                <CardDescription>Common issues and their solutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {troubleshootingGuide.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-red-600 mb-2">{item.issue}</h4>
                      <p className="text-gray-700 mb-3">{item.solution}</p>
                      <div className="bg-gray-50 p-3 rounded">
                        <h5 className="font-medium text-sm mb-2">Detailed Steps:</h5>
                        <ul className="text-sm space-y-1">
                          {item.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;