import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Telescope, TrendingUp, Clock, AlertCircle, Target, Zap, BarChart3, Lightbulb } from 'lucide-react';

const TrendForecaster = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [forecasts, setForecasts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchForecasts();
    fetchAlerts();
    fetchTrendingTopics();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/trend-forecasting/dashboard`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        // Mock dashboard data
        setDashboardData({
          summary: {
            total_forecasts: 12,
            high_confidence_forecasts: 5,
            active_alerts: 8,
            urgent_opportunities: 3
          },
          top_forecasts: [
            {
              trend_topic: "AI-generated content",
              confidence_score: 0.89,
              current_popularity_score: 85,
              recommended_action: "act_now"
            },
            {
              trend_topic: "Behind-the-scenes content",
              confidence_score: 0.82,
              current_popularity_score: 72,
              recommended_action: "prepare_for_peak"
            }
          ],
          urgent_alerts: [
            {
              trend_topic: "Sustainable fashion",
              urgency_level: "high",
              opportunity_window: 7,
              potential_reach_increase: 35.2
            }
          ],
          trending_now: [
            {
              trend: "AI-generated content",
              popularity: 85,
              growth_rate: 25,
              recommended_action: "act_now"
            },
            {
              trend: "Short-form educational content",
              popularity: 78,
              growth_rate: 18,
              recommended_action: "prepare_for_peak"
            },
            {
              trend: "Behind-the-scenes content",
              popularity: 72,
              growth_rate: 12,
              recommended_action: "act_now"
            }
          ],
          forecast_accuracy: {
            last_month: 78.5,
            trend_direction: "improving",
            confidence_level: "high"
          }
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData({
        summary: { total_forecasts: 0, high_confidence_forecasts: 0, active_alerts: 0, urgent_opportunities: 0 },
        top_forecasts: [],
        urgent_alerts: [],
        trending_now: [],
        forecast_accuracy: { last_month: 0, trend_direction: "stable", confidence_level: "medium" }
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchForecasts = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/trend-forecasting/forecast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          user_id: "user_123",
          forecast_horizon_days: 30,
          include_emerging_trends: true,
          min_confidence_threshold: 0.7
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setForecasts(data);
      } else {
        // Mock forecasts
        setForecasts([
          {
            id: "1",
            trend_topic: "Sustainable living tips",
            current_popularity_score: 78.5,
            predicted_peak_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            predicted_decline_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
            trend_duration_estimate: 15,
            confidence_score: 0.85,
            driving_factors: ["Environmental awareness", "Cost-saving benefits", "Lifestyle changes"],
            content_opportunities: [
              "Create sustainability challenge content",
              "Share eco-friendly product reviews",
              "Collaborate with environmental influencers"
            ],
            recommended_action: "act_now",
            category: "lifestyle",
            platform: "instagram"
          },
          {
            id: "2",
            trend_topic: "Home workout routines",
            current_popularity_score: 65.2,
            predicted_peak_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            predicted_decline_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
            trend_duration_estimate: 13,
            confidence_score: 0.78,
            driving_factors: ["Convenience", "Cost-effectiveness", "Health consciousness"],
            content_opportunities: [
              "Create beginner-friendly workout videos",
              "Share equipment-free exercises",
              "Post transformation stories"
            ],
            recommended_action: "prepare_for_peak",
            category: "fitness",
            platform: "tiktok"
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching forecasts:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/trend-forecasting/alerts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
      } else {
        // Mock alerts
        setAlerts([
          {
            id: "1",
            trend_id: "trend_1",
            alert_type: "emerging",
            urgency_level: "high",
            opportunity_window: 5,
            potential_reach_increase: 42.3,
            content_suggestions: [
              "Jump on trending hashtag #NewTrend",
              "Create content around viral topic",
              "Engage with trend community"
            ],
            competitor_activity: {
              adoption_rate: 65.4,
              engagement_impact: 28.7
            },
            created_at: new Date().toISOString()
          },
          {
            id: "2",
            trend_id: "trend_2",
            alert_type: "peaking",
            urgency_level: "critical",
            opportunity_window: 2,
            potential_reach_increase: 55.8,
            content_suggestions: [
              "Act immediately on peak trend",
              "Maximize content output during peak",
              "Leverage peak engagement times"
            ],
            competitor_activity: {
              adoption_rate: 89.2,
              engagement_impact: 45.1
            },
            created_at: new Date().toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const fetchTrendingTopics = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/trend-forecasting/trending-topics?limit=10`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTrendingTopics(data.trending_topics || []);
      } else {
        // Mock trending topics
        setTrendingTopics([
          {
            topic: "AI and automation",
            popularity_score: 92.1,
            growth_rate: 34.5,
            estimated_peak: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            engagement_potential: "very_high",
            content_gap: "medium"
          },
          {
            topic: "Sustainable living",
            popularity_score: 87.3,
            growth_rate: 28.2,
            estimated_peak: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
            engagement_potential: "high",
            content_gap: "low"
          },
          {
            topic: "Mental health awareness",
            popularity_score: 84.7,
            growth_rate: 22.1,
            estimated_peak: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
            engagement_potential: "high",
            content_gap: "high"
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching trending topics:', error);
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'act_now': return 'bg-red-100 text-red-800 border-red-200';
      case 'prepare_for_peak': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'wait_and_see': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getEngagementColor = (potential) => {
    switch (potential) {
      case 'very_high': return 'text-green-600';
      case 'high': return 'text-blue-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading trend forecasts...</p>
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
              <Telescope className="h-8 w-8 text-purple-600" />
              Trend Forecaster
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              AI-powered trend forecasting and opportunity identification
            </p>
          </div>
          
          <Button onClick={fetchDashboardData}>
            <Zap className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Forecasts</CardTitle>
              <Telescope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.summary?.total_forecasts || 0}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData?.summary?.high_confidence_forecasts || 0} high confidence
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.summary?.active_alerts || 0}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData?.summary?.urgent_opportunities || 0} urgent
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Forecast Accuracy</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.forecast_accuracy?.last_month || 0}%</div>
              <p className="text-xs text-muted-foreground capitalize">
                {dashboardData?.forecast_accuracy?.trend_direction || 'stable'} trend
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confidence Level</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{dashboardData?.forecast_accuracy?.confidence_level || 'Medium'}</div>
              <p className="text-xs text-muted-foreground">System confidence</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="forecasts" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="trending">Trending Now</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="forecasts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Trend Forecasts
                </CardTitle>
                <CardDescription>AI-powered predictions for upcoming trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {forecasts.map((forecast) => (
                    <div key={forecast.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="font-medium text-lg">{forecast.trend_topic}</div>
                          <div className="text-sm text-gray-600 capitalize">
                            {forecast.category} • {forecast.platform}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getActionColor(forecast.recommended_action)}>
                            {forecast.recommended_action.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <div className="text-sm text-gray-600 mt-1">
                            {forecast.trend_duration_estimate} days duration
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">Current Popularity</span>
                            <span className="text-sm font-medium">{forecast.current_popularity_score}%</span>
                          </div>
                          <Progress value={forecast.current_popularity_score} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">Confidence</span>
                            <span className="text-sm font-medium">{(forecast.confidence_score * 100).toFixed(0)}%</span>
                          </div>
                          <Progress value={forecast.confidence_score * 100} className="h-2" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm font-medium mb-2">Driving Factors:</div>
                          <div className="space-y-1">
                            {forecast.driving_factors.map((factor, index) => (
                              <div key={index} className="text-sm flex items-center gap-2">
                                <span className="text-blue-600">•</span>
                                <span>{factor}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium mb-2">Peak Timeline:</div>
                          <div className="text-sm text-gray-600">
                            <div>Peak: {new Date(forecast.predicted_peak_date).toLocaleDateString()}</div>
                            <div>Decline: {new Date(forecast.predicted_decline_date).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-2">Content Opportunities:</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {forecast.content_opportunities.map((opportunity, index) => (
                            <div key={index} className="p-2 bg-green-50 border border-green-200 rounded-lg text-sm">
                              {opportunity}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {forecasts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No forecasts available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  Trend Opportunity Alerts
                </CardTitle>
                <CardDescription>Time-sensitive opportunities requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className={`p-4 border rounded-lg ${getUrgencyColor(alert.urgency_level)}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Badge className={alert.urgency_level === 'critical' ? 'bg-red-600' : alert.urgency_level === 'high' ? 'bg-orange-600' : 'bg-yellow-600'}>
                            {alert.urgency_level.toUpperCase()}
                          </Badge>
                          <div className="font-medium mt-1 capitalize">
                            {alert.alert_type} Trend Opportunity
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {alert.opportunity_window} days remaining
                          </div>
                          <div className="text-xs text-gray-600">
                            +{alert.potential_reach_increase}% reach potential
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm font-medium mb-2">Recommended Actions:</div>
                        <div className="space-y-1">
                          {alert.content_suggestions.map((suggestion, index) => (
                            <div key={index} className="text-sm flex items-start gap-2">
                              <Zap className="h-3 w-3 text-orange-600 mt-1" />
                              <span>{suggestion}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Competitor Adoption:</span>
                          <span className="ml-2 font-medium">{alert.competitor_activity.adoption_rate}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Engagement Impact:</span>
                          <span className="ml-2 font-medium">+{alert.competitor_activity.engagement_impact}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {alerts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No active alerts
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Trending Topics Right Now
                </CardTitle>
                <CardDescription>Current trending topics and their growth patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="font-medium text-lg">{topic.topic}</div>
                          <div className="text-sm text-gray-600">
                            Peak estimated: {new Date(topic.estimated_peak).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">{topic.popularity_score}%</div>
                          <div className="text-sm text-green-600">+{topic.growth_rate}% growth</div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <Progress value={topic.popularity_score} className="h-3" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-600">Engagement Potential:</span>
                          <span className={`ml-2 text-sm font-medium ${getEngagementColor(topic.engagement_potential)}`}>
                            {topic.engagement_potential.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Content Gap:</span>
                          <span className="ml-2 text-sm font-medium capitalize">{topic.content_gap}</span>
                        </div>
                      </div>
                    </div>
                  ))} 
                  
                  {trendingTopics.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No trending topics available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    Forecasting Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">
                        {dashboardData?.forecast_accuracy?.last_month || 0}%
                      </div>
                      <div className="text-sm text-gray-600">Last Month Accuracy</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {dashboardData?.summary?.high_confidence_forecasts || 0}
                        </div>
                        <div className="text-sm text-gray-600">High Confidence</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">
                          {dashboardData?.summary?.total_forecasts || 0}
                        </div>
                        <div className="text-sm text-gray-600">Total Forecasts</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-800">Trend Pattern Analysis</div>
                      <div className="text-sm text-blue-600">
                        Video content consistently shows 2x faster trend adoption
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium text-green-800">Optimal Timing</div>
                      <div className="text-sm text-green-600">
                        Early trend adoption (first 3 days) yields 40% higher engagement
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="font-medium text-purple-800">Forecasting Accuracy</div>
                      <div className="text-sm text-purple-600">
                        Our AI models show {dashboardData?.forecast_accuracy?.confidence_level} confidence levels
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TrendForecaster;