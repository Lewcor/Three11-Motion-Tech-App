import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Brain, TrendingUp, Target, AlertCircle, BarChart3, Zap, Eye, Heart, Users, Clock, Lightbulb, TestTube, Telescope } from 'lucide-react';

const IntelligenceDashboard = () => {
  const [intelligenceData, setIntelligenceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchIntelligenceData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchIntelligenceData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchIntelligenceData = async () => {
    try {
      setRefreshing(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/intelligence/dashboard`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIntelligenceData(data);
      } else {
        // Mock comprehensive intelligence data
        setIntelligenceData({
          intelligence_score: 87,
          performance_summary: {
            avg_engagement_rate: 6.2,
            total_content_pieces: 42,
            top_performing_platform: "instagram"
          },
          trend_opportunities: {
            high_confidence_forecasts: 5,
            urgent_trends: [
              {
                trend_topic: "AI-generated content",
                confidence_score: 0.89,
                recommended_action: "act_now",
                opportunity_window: 7
              },
              {
                trend_topic: "Behind-the-scenes content",
                confidence_score: 0.82,
                recommended_action: "prepare_for_peak",
                opportunity_window: 12
              }
            ],
            next_big_trend: "Sustainable lifestyle content"
          },
          competitive_intelligence: {
            high_priority_alerts: 3,
            competitive_position: "Strong",
            key_opportunities: [
              "Video content gap identified",
              "Underutilized trending hashtags",
              "Optimal posting times available"
            ]
          },
          optimization_insights: {
            predicted_engagement_boost: "+32%",
            active_experiments: 2,
            next_recommended_test: "Caption hook optimization",
            best_posting_time: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString()
          },
          key_recommendations: [
            "Focus on video content for 25% engagement boost",
            "Test new posting times during identified peak hours",
            "Capitalize on emerging trend: AI-generated content",
            "Implement competitor strategy: behind-the-scenes content"
          ],
          alerts_summary: {
            total_active_alerts: 8,
            urgent_actions_needed: 2,
            opportunities_expiring_soon: 1
          }
        });
      }
    } catch (error) {
      console.error('Error fetching intelligence data:', error);
      // Set fallback data
      setIntelligenceData({
        intelligence_score: 75,
        performance_summary: { avg_engagement_rate: 4.2, total_content_pieces: 28, top_performing_platform: "instagram" },
        trend_opportunities: { high_confidence_forecasts: 3, urgent_trends: [], next_big_trend: "Educational content" },
        competitive_intelligence: { high_priority_alerts: 1, competitive_position: "Good", key_opportunities: [] },
        optimization_insights: { predicted_engagement_boost: "+20%", active_experiments: 1, next_recommended_test: "Hashtag optimization", best_posting_time: new Date().toISOString() },
        key_recommendations: ["Increase posting frequency", "Use more visual content"],
        alerts_summary: { total_active_alerts: 3, urgent_actions_needed: 1, opportunities_expiring_soon: 0 }
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getIntelligenceScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getIntelligenceScoreBadge = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  const getCompetitivePositionColor = (position) => {
    switch (position.toLowerCase()) {
      case 'strong': return 'text-green-600';
      case 'improving': return 'text-blue-600';
      case 'average': return 'text-yellow-600';
      default: return 'text-red-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading intelligence dashboard...</p>
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
              <Brain className="h-8 w-8 text-purple-600" />
              Intelligence Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Comprehensive AI-powered insights and strategic recommendations
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className={`${getIntelligenceScoreColor(intelligenceData?.intelligence_score || 0)} text-lg px-3 py-1`}>
              Intelligence Score: {intelligenceData?.intelligence_score || 0}
            </Badge>
            <Button onClick={fetchIntelligenceData} disabled={refreshing}>
              {refreshing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        {/* Intelligence Score Overview */}
        <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Overall Intelligence Score</h2>
                <div className="text-6xl font-bold mb-2">{intelligenceData?.intelligence_score || 0}</div>
                <Badge className="bg-white/20 text-white">
                  {getIntelligenceScoreBadge(intelligenceData?.intelligence_score || 0)}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-lg opacity-90">Performance Level</div>
                <Progress 
                  value={intelligenceData?.intelligence_score || 0} 
                  className="w-32 h-3 bg-white/20"
                />
                <div className="text-sm opacity-75 mt-2">
                  Updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{intelligenceData?.performance_summary?.avg_engagement_rate || 0}%</div>
              <p className="text-xs text-muted-foreground">
                Across {intelligenceData?.performance_summary?.total_content_pieces || 0} posts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trend Opportunities</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{intelligenceData?.trend_opportunities?.high_confidence_forecasts || 0}</div>
              <p className="text-xs text-muted-foreground">High confidence forecasts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Experiments</CardTitle>
              <TestTube className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{intelligenceData?.optimization_insights?.active_experiments || 0}</div>
              <p className="text-xs text-muted-foreground">A/B tests running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent Actions</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{intelligenceData?.alerts_summary?.urgent_actions_needed || 0}</div>
              <p className="text-xs text-muted-foreground">Actions needed</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="competitive">Competitive</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Key Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    Key Recommendations
                  </CardTitle>
                  <CardDescription>AI-powered strategic recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {intelligenceData?.key_recommendations?.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                          <Zap className="h-3 w-3 text-blue-600" />
                        </div>
                        <div className="text-sm">{recommendation}</div>
                      </div>
                    )) || (
                      <div className="text-center py-4 text-gray-500">
                        No recommendations available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Urgent Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Urgent Trend Opportunities
                  </CardTitle>
                  <CardDescription>Act on these trends before they peak</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {intelligenceData?.trend_opportunities?.urgent_trends?.map((trend, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="font-medium">{trend.trend_topic}</div>
                            <div className="text-sm text-gray-600">
                              {trend.opportunity_window} days remaining
                            </div>
                          </div>
                          <Badge className={trend.recommended_action === 'act_now' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                            {trend.recommended_action === 'act_now' ? 'Act Now' : 'Prepare'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">Confidence:</span>
                          <Progress value={trend.confidence_score * 100} className="flex-1 h-2" />
                          <span className="text-xs font-medium">{(trend.confidence_score * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-4 text-gray-500">
                        No urgent trends identified
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Competitive Position */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Competitive Intelligence Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getCompetitivePositionColor(intelligenceData?.competitive_intelligence?.competitive_position || 'Average')}`}>
                      {intelligenceData?.competitive_intelligence?.competitive_position || 'Average'}
                    </div>
                    <div className="text-sm text-gray-600">Competitive Position</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">
                      {intelligenceData?.competitive_intelligence?.high_priority_alerts || 0}
                    </div>
                    <div className="text-sm text-gray-600">High Priority Alerts</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {intelligenceData?.competitive_intelligence?.key_opportunities?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Key Opportunities</div>
                  </div>
                </div>

                {intelligenceData?.competitive_intelligence?.key_opportunities?.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Key Opportunities:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {intelligenceData.competitive_intelligence.key_opportunities.map((opportunity, index) => (
                        <div key={index} className="p-2 bg-green-50 rounded-lg text-sm text-green-800">
                          {opportunity}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Performance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Average Engagement Rate</span>
                      <span className="text-lg font-bold text-blue-600">
                        {intelligenceData?.performance_summary?.avg_engagement_rate || 0}%
                      </span>
                    </div>
                    <Progress value={(intelligenceData?.performance_summary?.avg_engagement_rate || 0) * 10} className="h-3" />
                    
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div>
                        <div className="text-2xl font-bold">{intelligenceData?.performance_summary?.total_content_pieces || 0}</div>
                        <div className="text-sm text-gray-600">Total Content Pieces</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold capitalize">{intelligenceData?.performance_summary?.top_performing_platform || 'N/A'}</div>
                        <div className="text-sm text-gray-600">Top Platform</div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="font-medium text-green-800 mb-1">Predicted Boost</div>
                      <div className="text-2xl font-bold text-green-600">
                        {intelligenceData?.optimization_insights?.predicted_engagement_boost || '+0%'}
                      </div>
                      <div className="text-sm text-green-600">
                        With recommended optimizations
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    Optimization Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-2">Next Recommended Test</div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="font-medium text-blue-800">
                          {intelligenceData?.optimization_insights?.next_recommended_test || 'Content optimization'}
                        </div>
                        <div className="text-sm text-blue-600 mt-1">
                          Based on your performance patterns
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">Best Posting Time</div>
                      <div className="text-lg font-bold text-orange-600">
                        {intelligenceData?.optimization_insights?.best_posting_time ? 
                          new Date(intelligenceData.optimization_insights.best_posting_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                          : 'N/A'
                        }
                      </div>
                      <div className="text-sm text-gray-600">
                        {intelligenceData?.optimization_insights?.best_posting_time ? 
                          new Date(intelligenceData.optimization_insights.best_posting_time).toLocaleDateString()
                          : 'No data available'
                        }
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">Active Experiments</div>
                      <div className="text-3xl font-bold text-green-600">
                        {intelligenceData?.optimization_insights?.active_experiments || 0}
                      </div>
                      <div className="text-sm text-gray-600">Currently running</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Telescope className="h-5 w-5 text-purple-600" />
                  Trend Intelligence
                </CardTitle>
                <CardDescription>Advanced trend forecasting and opportunity identification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {intelligenceData?.trend_opportunities?.high_confidence_forecasts || 0}
                    </div>
                    <div className="text-sm text-gray-600">High Confidence Forecasts</div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {intelligenceData?.trend_opportunities?.urgent_trends?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Urgent Opportunities</div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {intelligenceData?.trend_opportunities?.next_big_trend || 'TBD'}
                    </div>
                    <div className="text-sm text-gray-600">Next Big Trend</div>
                  </div>
                </div>

                {intelligenceData?.trend_opportunities?.urgent_trends?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-4">Urgent Trend Opportunities</h4>
                    <div className="space-y-3">
                      {intelligenceData.trend_opportunities.urgent_trends.map((trend, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="font-medium text-lg">{trend.trend_topic}</div>
                              <div className="text-sm text-gray-600">
                                Window: {trend.opportunity_window} days remaining
                              </div>
                            </div>
                            <Badge className={trend.recommended_action === 'act_now' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                              {trend.recommended_action === 'act_now' ? 'ACT NOW' : 'PREPARE'}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">Confidence:</span>
                            <Progress value={trend.confidence_score * 100} className="flex-1 h-2" />
                            <span className="text-sm font-medium">{(trend.confidence_score * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitive" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-600" />
                  Competitive Intelligence
                </CardTitle>
                <CardDescription>Monitor competitors and identify strategic opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Current Position</h4>
                    <div className="text-center p-6 border rounded-lg">
                      <div className={`text-4xl font-bold ${getCompetitivePositionColor(intelligenceData?.competitive_intelligence?.competitive_position || 'Average')}`}>
                        {intelligenceData?.competitive_intelligence?.competitive_position || 'Average'}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">Competitive Position</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Active Monitoring</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">High Priority Alerts</span>
                        <Badge variant="destructive">
                          {intelligenceData?.competitive_intelligence?.high_priority_alerts || 0}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">Opportunities Identified</span>
                        <Badge variant="default">
                          {intelligenceData?.competitive_intelligence?.key_opportunities?.length || 0}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {intelligenceData?.competitive_intelligence?.key_opportunities?.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Strategic Opportunities</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {intelligenceData.competitive_intelligence.key_opportunities.map((opportunity, index) => (
                        <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="text-sm font-medium text-green-800">{opportunity}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Optimization Center
                </CardTitle>
                <CardDescription>AI-powered recommendations to improve your content performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">Performance Optimization</h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="font-medium text-blue-800 mb-2">Predicted Engagement Boost</div>
                        <div className="text-3xl font-bold text-blue-600">
                          {intelligenceData?.optimization_insights?.predicted_engagement_boost || '+0%'}
                        </div>
                        <div className="text-sm text-blue-600 mt-1">
                          With AI-recommended optimizations
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="font-medium mb-2">Next Recommended Test</div>
                        <div className="text-lg text-purple-600">
                          {intelligenceData?.optimization_insights?.next_recommended_test || 'Content optimization'}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          High-impact optimization opportunity
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Active Experiments</h4>
                    <div className="text-center p-6 border rounded-lg mb-4">
                      <div className="text-4xl font-bold text-green-600">
                        {intelligenceData?.optimization_insights?.active_experiments || 0}
                      </div>
                      <div className="text-sm text-gray-600">Currently Running</div>
                    </div>

                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="font-medium text-orange-800 mb-2">Optimal Posting Time</div>
                      <div className="text-xl font-bold text-orange-600">
                        {intelligenceData?.optimization_insights?.best_posting_time ? 
                          new Date(intelligenceData.optimization_insights.best_posting_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                          : 'Not available'
                        }
                      </div>
                      <div className="text-sm text-orange-600 mt-1">
                        Based on audience activity patterns
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Alerts Summary */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Active Alerts Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {intelligenceData?.alerts_summary?.urgent_actions_needed || 0}
                </div>
                <div className="text-sm text-red-600">Urgent Actions</div>
              </div>
              
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {intelligenceData?.alerts_summary?.opportunities_expiring_soon || 0}
                </div>
                <div className="text-sm text-yellow-600">Expiring Soon</div>
              </div>
              
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {intelligenceData?.alerts_summary?.total_active_alerts || 0}
                </div>
                <div className="text-sm text-blue-600">Total Active</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntelligenceDashboard;