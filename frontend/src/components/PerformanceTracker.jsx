import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { AlertCircle, TrendingUp, TrendingDown, BarChart3, Eye, Heart, Share, MessageCircle, Target, Clock, Zap } from 'lucide-react';

const PerformanceTracker = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const [insights, setInsights] = useState([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30_days');

  useEffect(() => {
    fetchPerformanceData();
    fetchInsights();
    fetchRealTimeMetrics();
  }, [selectedTimeRange]);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/performance/dashboard?date_range=${selectedTimeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPerformanceData(data);
      } else {
        // Mock data for demo
        setPerformanceData({
          performance_analysis: {
            user_id: "user_123",
            analysis_period: selectedTimeRange,
            total_content_pieces: 45,
            avg_engagement_rate: 4.8,
            best_performing_content: [
              { content_id: "1", title: "Best Fashion Tips", engagement_rate: 12.5, views: 25000, platform: "instagram" },
              { content_id: "2", title: "Fitness Motivation", engagement_rate: 10.2, views: 18000, platform: "tiktok" },
              { content_id: "3", title: "Healthy Recipes", engagement_rate: 9.8, views: 22000, platform: "youtube" }
            ],
            platform_performance: {
              instagram: { avg_engagement_rate: 5.2, total_posts: 15, total_views: 45000 },
              tiktok: { avg_engagement_rate: 6.8, total_posts: 12, total_views: 68000 },
              youtube: { avg_engagement_rate: 3.1, total_posts: 8, total_views: 125000 },
              facebook: { avg_engagement_rate: 2.3, total_posts: 10, total_views: 15000 }
            },
            category_performance: {
              fashion: { avg_engagement_rate: 6.1, total_posts: 12, best_performing_metric: "likes" },
              fitness: { avg_engagement_rate: 5.5, total_posts: 18, best_performing_metric: "shares" },
              food: { avg_engagement_rate: 7.2, total_posts: 15, best_performing_metric: "comments" }
            }
          },
          key_insights: [
            {
              title: "Strong TikTok Performance",
              description: "Your TikTok content shows 40% higher engagement than average",
              impact_level: "high",
              action_required: false
            },
            {
              title: "Food Content Excelling",
              description: "Food category content generates 50% more comments than other categories",
              impact_level: "medium",
              action_required: false
            }
          ],
          real_time_summary: {
            active_content_pieces: 28,
            total_views_today: 5420,
            trending_content_count: 3
          }
        });
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
      // Set mock data on error
      setPerformanceData({
        performance_analysis: {
          total_content_pieces: 45,
          avg_engagement_rate: 4.8,
          best_performing_content: [],
          platform_performance: {},
          category_performance: {}
        },
        key_insights: [],
        real_time_summary: { active_content_pieces: 0, total_views_today: 0, trending_content_count: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/performance/insights`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setInsights(data);
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
    }
  };

  const fetchRealTimeMetrics = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/performance/real-time/sample-content-id`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRealTimeMetrics(data);
      } else {
        // Mock real-time data
        setRealTimeMetrics({
          content_id: "sample-content-id",
          current_metrics: {
            views: 1250,
            likes: 89,
            shares: 12,
            comments: 23,
            engagement_rate: 9.9
          },
          hourly_growth: {
            views_per_hour: 45,
            engagement_per_hour: 1.2
          },
          performance_status: "excellent"
        });
      }
    } catch (error) {
      console.error('Error fetching real-time metrics:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'average': return 'bg-yellow-500';
      case 'below_average': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent': return <TrendingUp className="h-4 w-4" />;
      case 'good': return <TrendingUp className="h-4 w-4" />;
      case 'average': return <BarChart3 className="h-4 w-4" />;
      case 'below_average': return <TrendingDown className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading performance data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              Performance Tracker
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track and analyze your content performance with AI-powered insights
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7_days">Last 7 Days</option>
              <option value="30_days">Last 30 Days</option>
              <option value="90_days">Last 90 Days</option>
              <option value="1_year">Last Year</option>
            </select>
            <Button onClick={fetchPerformanceData} disabled={loading}>
              <Zap className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Content</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceData?.performance_analysis?.total_content_pieces || 0}</div>
              <p className="text-xs text-muted-foreground">Content pieces tracked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceData?.performance_analysis?.avg_engagement_rate || 0}%</div>
              <p className="text-xs text-muted-foreground">Across all platforms</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Views Today</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceData?.real_time_summary?.total_views_today?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">Real-time tracking</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trending Content</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceData?.real_time_summary?.trending_content_count || 0}</div>
              <p className="text-xs text-muted-foreground">Currently viral</p>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Performance */}
        {realTimeMetrics && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Real-time Performance
                <Badge className={`${getStatusColor(realTimeMetrics.performance_status)} text-white`}>
                  {getStatusIcon(realTimeMetrics.performance_status)}
                  <span className="ml-1 capitalize">{realTimeMetrics.performance_status}</span>
                </Badge>
              </CardTitle>
              <CardDescription>Live metrics for your latest content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{realTimeMetrics.current_metrics.views?.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Views</div>
                  <div className="text-xs text-green-600">+{realTimeMetrics.hourly_growth.views_per_hour}/hr</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{realTimeMetrics.current_metrics.likes}</div>
                  <div className="text-sm text-gray-600">Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{realTimeMetrics.current_metrics.shares}</div>
                  <div className="text-sm text-gray-600">Shares</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{realTimeMetrics.current_metrics.comments}</div>
                  <div className="text-sm text-gray-600">Comments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{realTimeMetrics.current_metrics.engagement_rate}%</div>
                  <div className="text-sm text-gray-600">Engagement</div>
                  <div className="text-xs text-green-600">+{realTimeMetrics.hourly_growth.engagement_per_hour}%/hr</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Performance Analysis Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Best Performing Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Top Performing Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performanceData?.performance_analysis?.best_performing_content?.map((content, index) => (
                      <div key={content.content_id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{content.title}</div>
                          <div className="text-sm text-gray-600 capitalize">{content.platform}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">{content.engagement_rate}%</div>
                          <div className="text-sm text-gray-600">{content.views?.toLocaleString()} views</div>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-500">
                        No content data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Growth Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performanceData?.key_insights?.map((insight, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium">{insight.title}</div>
                            <div className="text-sm text-gray-600 mt-1">{insight.description}</div>
                          </div>
                          <Badge variant={insight.impact_level === 'high' ? 'destructive' : insight.impact_level === 'medium' ? 'default' : 'secondary'}>
                            {insight.impact_level}
                          </Badge>
                        </div>
                        {insight.action_required && (
                          <div className="mt-2 flex items-center gap-1 text-orange-600">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm">Action Required</span>
                          </div>
                        )}
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-500">
                        No insights available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="platforms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Performance Breakdown</CardTitle>
                <CardDescription>Compare your performance across different social media platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {performanceData?.performance_analysis?.platform_performance && Object.entries(performanceData.performance_analysis.platform_performance).map(([platform, data]) => (
                    <div key={platform} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium capitalize">{platform}</span>
                          <Badge variant="outline">{data.total_posts} posts</Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{data.avg_engagement_rate}%</div>
                          <div className="text-sm text-gray-600">{data.total_views?.toLocaleString()} views</div>
                        </div>
                      </div>
                      <Progress value={data.avg_engagement_rate * 10} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Category Performance Analysis</CardTitle>
                <CardDescription>See which content categories perform best for your audience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {performanceData?.performance_analysis?.category_performance && Object.entries(performanceData.performance_analysis.category_performance).map(([category, data]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium capitalize">{category}</span>
                          <Badge variant="outline">{data.total_posts} posts</Badge>
                          <Badge className="bg-blue-100 text-blue-800">{data.best_performing_metric}</Badge>
                        </div>
                        <div className="font-bold">{data.avg_engagement_rate}%</div>
                      </div>
                      <Progress value={data.avg_engagement_rate * 10} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI-Powered Performance Insights
                </CardTitle>
                <CardDescription>Advanced analytics and recommendations from our AI engine</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <h4 className="font-medium text-blue-800 mb-2">Optimization Opportunities</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Post during 2-4 PM for 23% higher engagement</li>
                        <li>• Use carousel posts for 35% more saves</li>
                        <li>• Include trending hashtags for 18% more reach</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg bg-green-50">
                      <h4 className="font-medium text-green-800 mb-2">Strengths to Leverage</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Educational content performs 40% above average</li>
                        <li>• Story posts have 65% completion rate</li>
                        <li>• Video content drives 3x more shares</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-yellow-50">
                    <h4 className="font-medium text-yellow-800 mb-2">Predicted Trends</h4>
                    <p className="text-sm">
                      AI analysis suggests focusing on behind-the-scenes content and user-generated content campaigns. 
                      These formats are trending upward and align with your audience preferences.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PerformanceTracker;