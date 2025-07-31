import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  Share2, 
  Calendar, 
  TrendingUp, 
  Users, 
  Heart, 
  MessageCircle,
  Repeat2,
  Eye,
  Settings,
  Plus,
  BarChart3,
  Clock,
  CheckCircle,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  PlaySquare,
  Zap,
  Target,
  Star
} from 'lucide-react';

const SocialMediaDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock social media dashboard data
  useEffect(() => {
    const mockData = {
      connected_accounts: [
        {
          platform: 'instagram',
          account_name: 'Fashion Creator',
          username: '@fashioncreator',
          followers_count: 15420,
          status: 'connected',
          profile_picture: null
        },
        {
          platform: 'facebook',
          account_name: 'Fashion Brand Page',
          username: 'fashionbrand',
          followers_count: 8750,
          status: 'connected',
          profile_picture: null
        },
        {
          platform: 'twitter',
          account_name: 'Fashion Trends',
          username: '@fashiontrends',
          followers_count: 12300,
          status: 'connected',
          profile_picture: null
        },
        {
          platform: 'linkedin',
          account_name: 'Professional Profile',
          username: 'fashion-expert',
          followers_count: 3450,
          status: 'connected',
          profile_picture: null
        }
      ],
      platform_metrics: [
        {
          platform: 'instagram',
          followers_count: 15420,
          posts_published: 18,
          total_engagement: 3240,
          avg_engagement_rate: 4.2,
          top_performing_post: {
            title: 'Fall Fashion Trends 2024',
            engagement: 890
          }
        },
        {
          platform: 'facebook',
          followers_count: 8750,
          posts_published: 12,
          total_engagement: 1560,
          avg_engagement_rate: 2.8,
          top_performing_post: {
            title: 'Behind the Scenes',
            engagement: 420
          }
        },
        {
          platform: 'twitter',
          followers_count: 12300,
          posts_published: 8,
          total_engagement: 980,
          avg_engagement_rate: 1.9,
          top_performing_post: {
            title: 'Style Tips Thread',
            engagement: 245
          }
        },
        {
          platform: 'linkedin',
          followers_count: 3450,
          posts_published: 7,
          total_engagement: 340,
          avg_engagement_rate: 3.5,
          top_performing_post: {
            title: 'Industry Insights',
            engagement: -120
          }
        }
      ],
      scheduled_posts_count: 15,
      published_posts_count: 42,
      total_reach: 125000,
      total_engagement: 8750,
      growth_metrics: {
        followers_growth: 12.5,
        engagement_growth: 18.3,
        reach_growth: 22.1
      },
      top_content: [
        {
          title: 'Fall Fashion Trends 2024',
          platform: 'instagram',
          engagement_rate: 8.5,
          reach: 15000,
          published_at: '2024-06-01T10:00:00Z'
        },
        {
          title: 'Behind the Scenes Video',
          platform: 'tiktok',
          engagement_rate: 12.3,
          reach: 25000,
          published_at: '2024-06-02T14:30:00Z'
        },
        {
          title: 'Style Tips & Tricks',
          platform: 'instagram',
          engagement_rate: 7.8,
          reach: 12000,
          published_at: '2024-06-03T16:15:00Z'
        }
      ],
      upcoming_posts: [
        {
          title: 'Weekend Style Guide',
          scheduled_time: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          platforms: ['instagram', 'facebook']
        },
        {
          title: 'Product Showcase',
          scheduled_time: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
          platforms: ['instagram', 'pinterest']
        },
        {
          title: 'Customer Spotlight',
          scheduled_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          platforms: ['facebook', 'linkedin']
        }
      ],
      automation_stats: {
        active_workflows: 4,
        posts_automated: 23,
        time_saved_hours: 34.5,
        automation_success_rate: 94.2
      }
    };

    setTimeout(() => {
      setDashboardData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-5 w-5 text-pink-500" />;
      case 'facebook':
        return <Facebook className="h-5 w-5 text-blue-600" />;
      case 'twitter':
        return <Twitter className="h-5 w-5 text-blue-400" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5 text-blue-700" />;
      case 'tiktok':
        return <PlaySquare className="h-5 w-5 text-black" />;
      default:
        return <Share2 className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getTimeUntilPost = (scheduledTime) => {
    const now = new Date();
    const scheduled = new Date(scheduledTime);
    const diffMs = scheduled - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `in ${diffHours}h ${diffMinutes}m`;
    } else if (diffMinutes > 0) {
      return `in ${diffMinutes}m`;
    } else {
      return 'Publishing soon';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading social media dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Social Media Dashboard
          </h1>
          <p className="text-gray-600">Manage your social media presence across all platforms</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="accounts" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Accounts
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Automation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(dashboardData.total_reach)}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+{dashboardData.growth_metrics.reach_growth}%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(dashboardData.total_engagement)}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+{dashboardData.growth_metrics.engagement_growth}%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Posts Published</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.published_posts_count}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData.scheduled_posts_count} scheduled
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Followers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(dashboardData.connected_accounts.reduce((total, acc) => total + acc.followers_count, 0))}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+{dashboardData.growth_metrics.followers_growth}%</span> growth
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Platform Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
                <CardDescription>Engagement rates across your connected platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.platform_metrics.map((platform) => (
                    <div key={platform.platform} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        {getPlatformIcon(platform.platform)}
                        <div>
                          <p className="font-medium capitalize">{platform.platform}</p>
                          <p className="text-sm text-gray-600">{formatNumber(platform.followers_count)} followers</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{platform.avg_engagement_rate}%</p>
                        <p className="text-sm text-gray-600">{platform.posts_published} posts</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Posts</CardTitle>
                <CardDescription>Scheduled content across your platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.upcoming_posts.map((post, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="font-medium">{post.title}</p>
                          <div className="flex gap-1 mt-1">
                            {post.platforms.map((platform) => (
                              <Badge key={platform} variant="secondary" className="text-xs">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-blue-600">
                          {getTimeUntilPost(post.scheduled_time)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dashboardData.connected_accounts.map((account) => (
              <Card key={account.platform}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    {getPlatformIcon(account.platform)}
                    <span className="capitalize">{account.platform}</span>
                    <Badge className="ml-auto text-green-700 bg-green-100">Connected</Badge>
                  </CardTitle>
                  <CardDescription>{account.account_name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Username</span>
                      <span className="font-medium">{account.username}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Followers</span>
                      <span className="font-medium">{formatNumber(account.followers_count)}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Manage Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add New Account Card */}
            <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <Plus className="h-8 w-8 text-gray-400 mb-3" />
                <h3 className="font-semibold mb-2">Connect New Account</h3>
                <p className="text-sm text-gray-600 mb-4">Add another social media platform</p>
                <Button variant="outline" size="sm">
                  Connect Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Content</CardTitle>
              <CardDescription>Your best performing posts across all platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.top_content.map((content, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold">
                        #{index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold">{content.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {getPlatformIcon(content.platform)}
                          <span className="text-sm text-gray-600 capitalize">{content.platform}</span>
                          <Badge variant="secondary" className="text-xs">
                            {content.engagement_rate}% engagement
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatNumber(content.reach)} reach</p>
                      <p className="text-sm text-gray-600">
                        {new Date(content.published_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.automation_stats.active_workflows}</div>
                <p className="text-xs text-muted-foreground">Automation rules running</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Posts Automated</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.automation_stats.posts_automated}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.automation_stats.time_saved_hours}h</div>
                <p className="text-xs text-muted-foreground">Through automation</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.automation_stats.automation_success_rate}%</div>
                <p className="text-xs text-muted-foreground">Automation reliability</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Automation Overview</CardTitle>
              <CardDescription>Your automated workflows are saving time and improving consistency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 border">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">High Engagement Auto-Share</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Automatically reposts your best performing content to maximize reach
                      </p>
                      <Badge className="mt-2 bg-green-100 text-green-700">Active</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Optimal Timing Scheduler</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Posts your content at the best times for maximum engagement
                      </p>
                      <Badge className="mt-2 bg-blue-100 text-blue-700">Active</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialMediaDashboard;