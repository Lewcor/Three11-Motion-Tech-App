import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { TestTube, Play, Pause, BarChart3, TrendingUp, Clock, Target, Lightbulb, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const ABTestingHub = () => {
  const [experiments, setExperiments] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const [newExperiment, setNewExperiment] = useState({
    test_name: '',
    test_type: 'caption_ab',
    category: 'fashion',
    platform: 'instagram',
    variant_a: { caption: '', hashtags: [] },
    variant_b: { caption: '', hashtags: [] },
    success_metric: 'engagement_rate',
    test_duration_days: 7
  });

  const testTypes = [
    { value: 'caption_ab', label: 'Caption A/B Test' },
    { value: 'hashtag_ab', label: 'Hashtag Strategy Test' },
    { value: 'visual_ab', label: 'Visual Content Test' },
    { value: 'posting_time_ab', label: 'Posting Time Test' },
    { value: 'format_ab', label: 'Content Format Test' }
  ];

  const successMetrics = [
    { value: 'engagement_rate', label: 'Engagement Rate' },
    { value: 'reach', label: 'Reach' },
    { value: 'conversions', label: 'Conversions' },
    { value: 'saves', label: 'Saves' },
    { value: 'shares', label: 'Shares' }
  ];

  useEffect(() => {
    fetchDashboardData();
    fetchExperiments();
    fetchSuggestions();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/ab-testing/dashboard`, {
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
            total_tests: 12,
            active_tests: 3,
            completed_tests: 9,
            average_improvement: 23.5
          },
          active_experiments: [
            {
              id: "1",
              test_name: "Caption Hook Test #1",
              test_type: "caption_ab",
              platform: "instagram",
              status: "running",
              sample_size: 245,
              current_winner: null
            }
          ],
          recent_results: [
            {
              id: "2",
              test_name: "Hashtag Strategy Test",
              test_type: "hashtag_ab",
              platform: "tiktok",
              status: "completed",
              current_winner: "b",
              improvement: 31.2
            }
          ],
          success_rate: 78.5
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData({
        summary: { total_tests: 0, active_tests: 0, completed_tests: 0, average_improvement: 0 },
        active_experiments: [],
        recent_results: [],
        success_rate: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchExperiments = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/ab-testing/user-experiments`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setExperiments(data);
      } else {
        // Mock experiments data
        setExperiments([
          {
            id: "exp_1",
            test_name: "Caption Hook Optimization",
            test_type: "caption_ab",
            platform: "instagram",
            category: "fashion",
            status: "running",
            created_at: new Date().toISOString(),
            success_metric: "engagement_rate",
            sample_size: 156,
            current_winner: null,
            improvement: null
          },
          {
            id: "exp_2",
            test_name: "Hashtag Strategy Test",
            test_type: "hashtag_ab",
            platform: "tiktok",
            category: "fitness",
            status: "completed",
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            success_metric: "reach",
            sample_size: 324,
            current_winner: "b",
            improvement: 28.5
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching experiments:', error);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/ab-testing/suggestions?platform=instagram&category=fashion`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      } else {
        // Mock suggestions
        setSuggestions([
          {
            test_type: "caption_ab",
            title: "Hook Effectiveness Test",
            description: "Test different opening hooks to see which generates more engagement",
            variant_a: { hook: "Question-based hook", example: "Did you know that...?" },
            variant_b: { hook: "Statement-based hook", example: "Here's why everyone is talking about..." },
            expected_improvement: "15-30%",
            duration_days: 7,
            priority: "high"
          },
          {
            test_type: "posting_time_ab",
            title: "Optimal Posting Time Test",
            description: "Find the best posting time for your audience",
            variant_a: { time: "Morning (9 AM)", rationale: "Catch commuters and early scrollers" },
            variant_b: { time: "Evening (7 PM)", rationale: "Target after-work social media usage" },
            expected_improvement: "20-40%",
            duration_days: 14,
            priority: "high"
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const createExperiment = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/ab-testing/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newExperiment)
      });
      
      if (response.ok) {
        const data = await response.json();
        setExperiments(prev => [data, ...prev]);
        // Reset form
        setNewExperiment({
          test_name: '',
          test_type: 'caption_ab',
          category: 'fashion',
          platform: 'instagram',
          variant_a: { caption: '', hashtags: [] },
          variant_b: { caption: '', hashtags: [] },
          success_metric: 'engagement_rate',
          test_duration_days: 7
        });
        setActiveTab('experiments');
      } else {
        alert('Error creating experiment');
      }
    } catch (error) {
      console.error('Error creating experiment:', error);
      alert('Error creating experiment');
    }
  };

  const startExperiment = async (experimentId) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/ab-testing/start/${experimentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        alert('Experiment started successfully!');
        fetchExperiments();
      } else {
        alert('Error starting experiment');
      }
    } catch (error) {
      console.error('Error starting experiment:', error);
      alert('Error starting experiment');
    }
  };

  const stopExperiment = async (experimentId) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/ab-testing/stop/${experimentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`Experiment completed! ${data.message}`);
        fetchExperiments();
      } else {
        alert('Error stopping experiment');
      }
    } catch (error) {
      console.error('Error stopping experiment:', error);
      alert('Error stopping experiment');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return <Play className="h-4 w-4 text-green-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'paused': return <Pause className="h-4 w-4 text-yellow-600" />;
      case 'draft': return <Clock className="h-4 w-4 text-gray-600" />;
      default: return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getWinnerBadge = (winner, improvement) => {
    if (!winner) return null;
    
    const color = winner === 'a' ? 'bg-blue-100 text-blue-800' : winner === 'b' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
    
    return (
      <Badge className={color}>
        {winner === 'tie' ? 'Tie' : `Variant ${winner.upper} wins (+${improvement}%)`}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading A/B testing data...</p>
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
              <TestTube className="h-8 w-8 text-green-600" />
              A/B Testing Hub
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Optimize your content with data-driven A/B testing experiments
            </p>
          </div>
        </div>

        {/* Dashboard Overview */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
                <TestTube className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.summary.total_tests}</div>
                <p className="text-xs text-muted-foreground">All time experiments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Tests</CardTitle>
                <Play className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.summary.active_tests}</div>
                <p className="text-xs text-muted-foreground">Currently running</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Improvement</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.summary.average_improvement}%</div>
                <p className="text-xs text-muted-foreground">From successful tests</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.success_rate}%</div>
                <p className="text-xs text-muted-foreground">Tests with positive results</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="experiments">Experiments</TabsTrigger>
            <TabsTrigger value="create">Create Test</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Experiments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-green-600" />
                    Active Experiments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.active_experiments?.map((experiment) => (
                      <div key={experiment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{experiment.test_name}</div>
                          <div className="text-sm text-gray-600 capitalize">{experiment.test_type.replace('_', ' ')}</div>
                          <div className="text-xs text-gray-500">{experiment.sample_size} participants</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(experiment.status)}
                          <Button size="sm" onClick={() => stopExperiment(experiment.id)}>
                            Stop
                          </Button>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-500">
                        No active experiments
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Recent Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.recent_results?.map((result) => (
                      <div key={result.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="font-medium">{result.test_name}</div>
                            <div className="text-sm text-gray-600 capitalize">{result.test_type.replace('_', ' ')}</div>
                          </div>
                          {getWinnerBadge(result.current_winner, result.improvement)}
                        </div>
                        {result.improvement && (
                          <div className="text-sm text-green-600 font-medium">
                            +{result.improvement}% improvement
                          </div>
                        )}
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-500">
                        No recent results
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="experiments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Experiments</CardTitle>
                <CardDescription>Manage and monitor your A/B testing experiments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {experiments.map((experiment) => (
                    <div key={experiment.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="font-medium text-lg">{experiment.test_name}</div>
                          <div className="text-sm text-gray-600 mb-1">
                            {experiment.test_type.replace('_', ' ')} • {experiment.platform} • {experiment.category}
                          </div>
                          <div className="text-xs text-gray-500">
                            Created: {new Date(experiment.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={experiment.status === 'running' ? 'default' : experiment.status === 'completed' ? 'secondary' : 'outline'}>
                            {getStatusIcon(experiment.status)}
                            <span className="ml-1 capitalize">{experiment.status}</span>
                          </Badge>
                          {experiment.status === 'draft' && (
                            <Button size="sm" onClick={() => startExperiment(experiment.id)}>
                              Start
                            </Button>
                          )}
                          {experiment.status === 'running' && (
                            <Button size="sm" variant="outline" onClick={() => stopExperiment(experiment.id)}>
                              Stop
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Success Metric</div>
                          <div className="font-medium capitalize">{experiment.success_metric.replace('_', ' ')}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Sample Size</div>
                          <div className="font-medium">{experiment.sample_size || 0}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Current Winner</div>
                          <div className="font-medium">
                            {experiment.current_winner ? `Variant ${experiment.current_winner.toUpperCase()}` : 'TBD'}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Improvement</div>
                          <div className="font-medium text-green-600">
                            {experiment.improvement ? `+${experiment.improvement}%` : 'N/A'}
                          </div>
                        </div>
                      </div>

                      {experiment.status === 'running' && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{experiment.sample_size}/500 participants</span>
                          </div>
                          <Progress value={(experiment.sample_size / 500) * 100} className="h-2" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {experiments.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <TestTube className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No experiments created yet</p>
                      <p className="text-sm">Create your first A/B test to optimize your content</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New A/B Test</CardTitle>
                <CardDescription>Set up a new experiment to test different content variations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Test Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Test Name</label>
                  <input
                    type="text"
                    value={newExperiment.test_name}
                    onChange={(e) => setNewExperiment(prev => ({ ...prev, test_name: e.target.value }))}
                    placeholder="e.g., Caption Hook Optimization"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Test Type, Category, Platform */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Test Type</label>
                    <select
                      value={newExperiment.test_type}
                      onChange={(e) => setNewExperiment(prev => ({ ...prev, test_type: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {testTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={newExperiment.category}
                      onChange={(e) => setNewExperiment(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="fashion">Fashion</option>
                      <option value="fitness">Fitness</option>
                      <option value="food">Food</option>
                      <option value="travel">Travel</option>
                      <option value="business">Business</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Platform</label>
                    <select
                      value={newExperiment.platform}
                      onChange={(e) => setNewExperiment(prev => ({ ...prev, platform: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="youtube">YouTube</option>
                      <option value="facebook">Facebook</option>
                    </select>
                  </div>
                </div>

                {/* Variants */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Variant A</label>
                    <textarea
                      value={newExperiment.variant_a.caption}
                      onChange={(e) => setNewExperiment(prev => ({
                        ...prev,
                        variant_a: { ...prev.variant_a, caption: e.target.value }
                      }))}
                      placeholder="Enter your first variant..."
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Variant B</label>
                    <textarea
                      value={newExperiment.variant_b.caption}
                      onChange={(e) => setNewExperiment(prev => ({
                        ...prev,
                        variant_b: { ...prev.variant_b, caption: e.target.value }
                      }))}
                      placeholder="Enter your second variant..."
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Test Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Success Metric</label>
                    <select
                      value={newExperiment.success_metric}
                      onChange={(e) => setNewExperiment(prev => ({ ...prev, success_metric: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {successMetrics.map(metric => (
                        <option key={metric.value} value={metric.value}>{metric.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Test Duration (Days)</label>
                    <input
                      type="number"
                      value={newExperiment.test_duration_days}
                      onChange={(e) => setNewExperiment(prev => ({ ...prev, test_duration_days: parseInt(e.target.value) }))}
                      min="1"
                      max="30"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Create Button */}
                <Button 
                  onClick={createExperiment} 
                  disabled={!newExperiment.test_name || !newExperiment.variant_a.caption || !newExperiment.variant_b.caption}
                  className="w-full"
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  Create A/B Test
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Test Suggestions
                </CardTitle>
                <CardDescription>AI-powered recommendations for A/B tests based on your content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="font-medium text-lg">{suggestion.title}</div>
                          <div className="text-sm text-gray-600 mb-2">{suggestion.description}</div>
                          <Badge variant={suggestion.priority === 'high' ? 'destructive' : 'default'}>
                            {suggestion.priority} priority
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">{suggestion.expected_improvement}</div>
                          <div className="text-xs text-gray-500">{suggestion.duration_days} days</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="font-medium text-blue-800 mb-1">Variant A</div>
                          <div className="text-sm text-blue-600">
                            {suggestion.variant_a.hook || suggestion.variant_a.time || suggestion.variant_a.strategy}
                          </div>
                          <div className="text-xs text-blue-500 mt-1">
                            {suggestion.variant_a.example || suggestion.variant_a.rationale}
                          </div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="font-medium text-green-800 mb-1">Variant B</div>
                          <div className="text-sm text-green-600">
                            {suggestion.variant_b.hook || suggestion.variant_b.time || suggestion.variant_b.strategy}
                          </div>
                          <div className="text-xs text-green-500 mt-1">
                            {suggestion.variant_b.example || suggestion.variant_b.rationale}
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => {
                          setNewExperiment(prev => ({
                            ...prev,
                            test_name: suggestion.title,
                            test_type: suggestion.test_type
                          }));
                          setActiveTab('create');
                        }}
                        variant="outline" 
                        className="w-full"
                      >
                        Use This Suggestion
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ABTestingHub;