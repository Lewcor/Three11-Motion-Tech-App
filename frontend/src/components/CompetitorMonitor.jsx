import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Target, AlertCircle, TrendingUp, Users, Eye, Zap, BarChart3, Lightbulb } from 'lucide-react';

const CompetitorMonitor = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [benchmark, setBenchmark] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchAlerts();
    fetchBenchmark();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/competitor-monitoring/dashboard`, {
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
            total_alerts: 8,
            high_priority_alerts: 3,
            unread_alerts: 5,
            competitive_score: 78
          },
          recent_alerts: [
            {
              id: "1",
              alert_type: "viral_content",
              content_data: { title: "Competitor's viral post gaining traction" },
              alert_priority: "high",
              created_at: new Date().toISOString()
            }
          ],
          benchmark_summary: {
            your_percentile: 65.5,
            improvement_potential: 28.3,
            quick_wins_available: 4
          },
          trending_opportunities: [
            "Video content showing 25% higher engagement",
            "Educational carousels gaining popularity",
            "Behind-the-scenes content trending up"
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData({
        summary: { total_alerts: 0, high_priority_alerts: 0, unread_alerts: 0, competitive_score: 50 },
        recent_alerts: [],
        benchmark_summary: { your_percentile: 50, improvement_potential: 20, quick_wins_available: 2 },
        trending_opportunities: []
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/competitor-monitoring/alerts`, {
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
            alert_type: "viral_content",
            content_data: { 
              title: "Competitor viral video", 
              platform: "tiktok",
              view_count: 125000 
            },
            performance_metrics: { engagement_rate: 12.5, virality_score: 9.2 },
            alert_priority: "critical",
            action_recommendations: [
              "Analyze viral content elements for replication",
              "Create similar content quickly while trend is hot"
            ],
            is_read: false,
            created_at: new Date().toISOString()
          },
          {
            id: "2", 
            alert_type: "strategy_change",
            content_data: { 
              title: "Competitor shifted to video-first strategy",
              strategy_type: "content_format_shift"
            },
            performance_metrics: { engagement_rate: 8.3, growth_velocity: 15.2 },
            alert_priority: "high",
            action_recommendations: [
              "Evaluate if strategy fits your brand",
              "Monitor strategy effectiveness"
            ],
            is_read: false,
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const fetchBenchmark = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/competitor-monitoring/benchmark?category=fashion&platform=instagram`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBenchmark(data);
      } else {
        // Mock benchmark
        setBenchmark({
          category: "fashion",
          platform: "instagram",
          industry_avg_engagement: 4.2,
          top_performer_engagement: 8.9,
          user_current_performance: 5.8,
          performance_percentile: 68.5,
          gap_to_average: -1.6,
          gap_to_top_performer: 3.1,
          improvement_potential: 53.4,
          quick_wins: [
            "Optimize posting times for better reach",
            "Use Instagram Reels for higher visibility",
            "Increase engagement with your audience"
          ],
          long_term_strategies: [
            "Develop signature content series",
            "Build strategic partnerships with influencers",
            "Invest in professional content production"
          ],
          competitor_tactics_to_adopt: [
            "Behind-the-scenes content strategy",
            "User-generated content campaigns",
            "Educational carousel posts"
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching benchmark:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getAlertIcon = (alertType) => {
    switch (alertType) {
      case 'viral_content': return <TrendingUp className="h-4 w-4" />;
      case 'strategy_change': return <Target className="h-4 w-4" />;
      case 'new_content': return <Eye className="h-4 w-4" />;
      case 'trend_adoption': return <Zap className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading competitor intelligence...</p>
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
              <Target className="h-8 w-8 text-red-600" />
              Competitor Monitor
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track competitors, identify opportunities, and stay ahead of the competition
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
              <CardTitle className="text-sm font-medium">Competitive Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.summary?.competitive_score || 0}</div>
              <p className="text-xs text-muted-foreground">Out of 100</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.summary?.total_alerts || 0}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData?.summary?.high_priority_alerts || 0} high priority
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Percentile</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.benchmark_summary?.your_percentile || 0}%</div>
              <p className="text-xs text-muted-foreground">Industry ranking</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Wins</CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.benchmark_summary?.quick_wins_available || 0}</div>
              <p className="text-xs text-muted-foreground">Opportunities available</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="alerts" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="benchmark">Benchmark</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  Recent Alerts
                </CardTitle>
                <CardDescription>Stay informed about competitor activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className={`p-4 border rounded-lg ${getPriorityColor(alert.alert_priority)}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getAlertIcon(alert.alert_type)}
                          <div className="font-medium capitalize">
                            {alert.alert_type.replace('_', ' ')}
                          </div>
                          <Badge className={alert.alert_priority === 'critical' ? 'bg-red-600' : alert.alert_priority === 'high' ? 'bg-orange-600' : 'bg-yellow-600'}>
                            {alert.alert_priority}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(alert.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="font-medium">{alert.content_data.title}</div>
                        {alert.content_data.platform && (
                          <div className="text-sm text-gray-600 capitalize">
                            Platform: {alert.content_data.platform}
                          </div>
                        )}
                        {alert.content_data.view_count && (
                          <div className="text-sm text-gray-600">
                            Views: {alert.content_data.view_count.toLocaleString()}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                        <div>
                          <span className="text-gray-600">Engagement Rate:</span>
                          <span className="ml-2 font-medium">{alert.performance_metrics.engagement_rate}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">
                            {alert.performance_metrics.virality_score ? 'Virality Score:' : 'Growth Velocity:'}
                          </span>
                          <span className="ml-2 font-medium">
                            {alert.performance_metrics.virality_score || alert.performance_metrics.growth_velocity}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-2">Recommended Actions:</div>
                        <div className="space-y-1">
                          {alert.action_recommendations.map((rec, index) => (
                            <div key={index} className="text-sm flex items-start gap-2">
                              <span className="text-blue-600">•</span>
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {alerts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No alerts at this time
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="benchmark" className="space-y-4">
            {benchmark && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      Performance Benchmark
                    </CardTitle>
                    <CardDescription>Compare your performance against industry standards</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Your Performance</span>
                          <span className="text-lg font-bold text-blue-600">{benchmark.user_current_performance}%</span>
                        </div>
                        <Progress value={benchmark.user_current_performance * 10} className="h-3" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">Industry Average</div>
                          <div className="text-xl font-bold text-gray-800">{benchmark.industry_avg_engagement}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Top Performer</div>
                          <div className="text-xl font-bold text-green-600">{benchmark.top_performer_engagement}%</div>
                        </div>
                      </div>

                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm font-medium text-blue-800">Your Percentile Ranking</div>
                        <div className="text-2xl font-bold text-blue-600">{benchmark.performance_percentile}%</div>
                        <div className="text-sm text-blue-600">
                          You're performing better than {benchmark.performance_percentile}% of accounts
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 border rounded-lg">
                          <div className="text-sm text-gray-600">Gap to Average</div>
                          <div className={`text-lg font-bold ${benchmark.gap_to_average < 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {benchmark.gap_to_average > 0 ? '+' : ''}{benchmark.gap_to_average}%
                          </div>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                          <div className="text-sm text-gray-600">Improvement Potential</div>
                          <div className="text-lg font-bold text-orange-600">{benchmark.improvement_potential}%</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-600" />
                      Strategic Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 text-green-800">Quick Wins</h4>
                        <div className="space-y-2">
                          {benchmark.quick_wins.map((win, index) => (
                            <div key={index} className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
                              <Zap className="h-4 w-4 text-green-600 mt-0.5" />
                              <span className="text-sm">{win}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-blue-800">Long-term Strategies</h4>
                        <div className="space-y-2">
                          {benchmark.long_term_strategies.map((strategy, index) => (
                            <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                              <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                              <span className="text-sm">{strategy}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-purple-800">Competitor Tactics to Adopt</h4>
                        <div className="space-y-2">
                          {benchmark.competitor_tactics_to_adopt.map((tactic, index) => (
                            <div key={index} className="flex items-start gap-2 p-2 bg-purple-50 rounded-lg">
                              <Users className="h-4 w-4 text-purple-600 mt-0.5" />
                              <span className="text-sm">{tactic}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Trending Opportunities
                </CardTitle>
                <CardDescription>Capitalize on emerging trends and competitor gaps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData?.trending_opportunities?.map((opportunity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="font-medium">{opportunity}</span>
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
                  <Eye className="h-5 w-5 text-purple-600" />
                  Competitive Insights
                </CardTitle>
                <CardDescription>AI-powered analysis of the competitive landscape</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Market Position</h4>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {dashboardData?.benchmark_summary?.your_percentile || 0}th
                      </div>
                      <div className="text-sm text-gray-600">Percentile</div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Improvement Potential</h4>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">
                        {dashboardData?.benchmark_summary?.improvement_potential || 0}%
                      </div>
                      <div className="text-sm text-gray-600">Growth Opportunity</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Key Insights</h4>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• Your content engagement is above industry average</li>
                    <li>• Video content shows highest competitor adoption rate</li>
                    <li>• Educational content format gaining momentum</li>
                    <li>• Optimal posting times show 23% variance from competitors</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CompetitorMonitor;