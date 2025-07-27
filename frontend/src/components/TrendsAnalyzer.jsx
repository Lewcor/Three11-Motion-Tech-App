import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Clock, 
  Hash, 
  Target, 
  BarChart3,
  Zap,
  Brain,
  Sparkles,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  Calendar,
  Users,
  Heart,
  Share2,
  Play,
  Filter,
  Search,
  Star
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';

const TrendsAnalyzer = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [trends, setTrends] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [trendAnalysis, setTrendAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [refreshTime, setRefreshTime] = useState(null);

  // Default demo trends for SEO and when API is unavailable
  const defaultTrends = [
    {
      id: 1,
      keyword: "AI Content Creation",
      platform: "instagram",
      category: "business",
      volume: 85,
      growth_rate: 32,
      engagement_score: 8.7,
      sentiment: "positive",
      last_updated: new Date().toISOString(),
      hashtags: ["#AIContent", "#ContentCreator", "#DigitalMarketing"]
    },
    {
      id: 2,
      keyword: "Social Media Trends 2025",
      platform: "tiktok",
      category: "all",
      volume: 78,
      growth_rate: 45,
      engagement_score: 9.2,
      sentiment: "positive",
      last_updated: new Date().toISOString(),
      hashtags: ["#Trends2025", "#SocialMedia", "#Viral"]
    },
    {
      id: 3,
      keyword: "Voice Studio Technology",
      platform: "youtube",
      category: "business",
      volume: 72,
      growth_rate: 28,
      engagement_score: 8.5,
      sentiment: "positive",
      last_updated: new Date().toISOString(),
      hashtags: ["#VoiceAI", "#AudioContent", "#Innovation"]
    },
    {
      id: 4,
      keyword: "Content Remix Strategies",
      platform: "facebook",
      category: "business",
      volume: 65,
      growth_rate: 25,
      engagement_score: 7.8,
      sentiment: "positive",
      last_updated: new Date().toISOString(),
      hashtags: ["#ContentStrategy", "#Remix", "#CreativeContent"]
    },
    {
      id: 5,
      keyword: "THREE11 Motion Tech",
      platform: "instagram",
      category: "business",
      volume: 92,
      growth_rate: 55,
      engagement_score: 9.5,
      sentiment: "positive",
      last_updated: new Date().toISOString(),
      hashtags: ["#THREE11", "#AITools", "#ContentSuite"]
    }
  ];

  const platforms = [
    { value: 'tiktok', label: 'TikTok', icon: '📱', color: 'bg-black' },
    { value: 'instagram', label: 'Instagram', icon: '📸', color: 'bg-pink-500' },
    { value: 'youtube', label: 'YouTube', icon: '📺', color: 'bg-red-500' },
    { value: 'facebook', label: 'Facebook', icon: '👥', color: 'bg-blue-500' }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'food', label: 'Food' },
    { value: 'travel', label: 'Travel' },
    { value: 'business', label: 'Business' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'music', label: 'Music' },
    { value: 'ideas', label: 'Ideas' },
    { value: 'event_space', label: 'Event Space' }
  ];

  useEffect(() => {
    fetchTrends();
  }, [selectedPlatform, selectedCategory]);

  const fetchTrends = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      
      const categoryParam = selectedCategory === 'all' ? '' : `?category=${selectedCategory}`;
      const response = await fetch(`${backendUrl}/api/trends/${selectedPlatform}${categoryParam}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Use API data if available, otherwise fall back to default trends
        const apiTrends = data.trends || [];
        if (apiTrends.length > 0) {
          setTrends(apiTrends);
        } else {
          // Filter default trends by platform and category
          const filteredDefaults = defaultTrends.filter(trend => {
            const platformMatch = trend.platform === selectedPlatform;
            const categoryMatch = selectedCategory === 'all' || trend.category === selectedCategory;
            return platformMatch && categoryMatch;
          });
          setTrends(filteredDefaults.length > 0 ? filteredDefaults : defaultTrends.slice(0, 3));
        }
        setRefreshTime(new Date());
      } else {
        console.error('Failed to fetch trends, using default trends');
        // Use default trends when API fails
        const filteredDefaults = defaultTrends.filter(trend => {
          const platformMatch = trend.platform === selectedPlatform;
          const categoryMatch = selectedCategory === 'all' || trend.category === selectedCategory;
          return platformMatch && categoryMatch;
        });
        setTrends(filteredDefaults.length > 0 ? filteredDefaults : defaultTrends.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching trends, using default trends:', error);
      // Use default trends when there's an error
      const filteredDefaults = defaultTrends.filter(trend => {
        const platformMatch = trend.platform === selectedPlatform;
        const categoryMatch = selectedCategory === 'all' || trend.category === selectedCategory;
        return platformMatch && categoryMatch;
      });
      setTrends(filteredDefaults.length > 0 ? filteredDefaults : defaultTrends.slice(0, 3));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPredictions = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      
      const response = await fetch(`${backendUrl}/api/trends/${selectedPlatform}/predictions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPredictions(data.predictions || []);
      } else {
        console.error('Failed to fetch predictions');
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrendAnalysis = async (keyword) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      
      const response = await fetch(`${backendUrl}/api/trends/${selectedPlatform}/analysis/${encodeURIComponent(keyword)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTrendAnalysis(data.analysis);
      } else {
        console.error('Failed to fetch trend analysis');
      }
    } catch (error) {
      console.error('Error fetching trend analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateContentFromTrend = async (trend) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      
      const response = await fetch(`${backendUrl}/api/trends/content-from-trend`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: trend.keyword,
          platform: trend.platform,
          category: trend.category
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // You could show this content in a modal or navigate to results page
        alert('Content generated successfully! Check your generated content section.');
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error generating content from trend:', error);
      alert('Error generating content from trend');
    } finally {
      setIsLoading(false);
    }
  };

  const getVolumeColor = (volume) => {
    if (volume > 80) return 'bg-red-500';
    if (volume > 60) return 'bg-orange-500';
    if (volume > 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getGrowthColor = (growth) => {
    if (growth > 20) return 'text-green-600';
    if (growth > 10) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTrends = trends.filter(trend => 
    trend.keyword.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            <TrendingUp className="inline mr-2 text-blue-600" />
            Real-Time Trends Analyzer
          </h1>
          <p className="text-gray-600">AI-powered trend analysis and content prediction</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Platform:</span>
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {platforms.map(platform => (
                  <SelectItem key={platform.value} value={platform.value}>
                    <div className="flex items-center gap-2">
                      <span>{platform.icon}</span>
                      <span>{platform.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Category:</span>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search trends..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-40"
            />
          </div>

          <Button 
            onClick={fetchTrends} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Last Updated */}
        {refreshTime && (
          <div className="text-center mb-6">
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Last updated: {refreshTime.toLocaleTimeString()}
            </Badge>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">Current Trends</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="analysis">Deep Analysis</TabsTrigger>
          </TabsList>

          {/* Current Trends Tab */}
          <TabsContent value="current" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTrends.map((trend, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{trend.keyword}</CardTitle>
                      <Badge className={`text-xs ${getSentimentColor(trend.sentiment)}`}>
                        {trend.sentiment}
                      </Badge>
                    </div>
                    <CardDescription>
                      <Badge variant="outline" className="text-xs">
                        {trend.category}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Volume */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Volume</span>
                        <span className="text-sm">{trend.volume}%</span>
                      </div>
                      <Progress value={trend.volume} className="h-2" />

                      {/* Growth Rate */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Growth</span>
                        <span className={`text-sm font-semibold ${getGrowthColor(trend.growth_rate)}`}>
                          +{trend.growth_rate}%
                        </span>
                      </div>

                      {/* Engagement Score */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Engagement</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">{trend.engagement_score}/10</span>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Est. Duration</span>
                        <span className="text-sm">{trend.predicted_duration} days</span>
                      </div>

                      {/* Hashtags */}
                      <div className="space-y-2">
                        <span className="text-sm font-medium">Hashtags</span>
                        <div className="flex flex-wrap gap-1">
                          {trend.related_hashtags.slice(0, 3).map((hashtag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {hashtag}
                            </Badge>
                          ))}
                          {trend.related_hashtags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{trend.related_hashtags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => fetchTrendAnalysis(trend.keyword)}
                          variant="outline"
                          className="flex-1"
                        >
                          <Brain className="w-4 h-4 mr-1" />
                          Analyze
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => generateContentFromTrend(trend)}
                          className="flex-1"
                        >
                          <Sparkles className="w-4 h-4 mr-1" />
                          Generate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTrends.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No trends found for the selected filters.</p>
              </div>
            )}
          </TabsContent>

          {/* Predictions Tab */}
          <TabsContent value="predictions" className="space-y-4">
            <div className="mb-4">
              <Button 
                onClick={fetchPredictions} 
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Brain className="w-4 h-4" />
                Generate Predictions
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predictions.map((prediction, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{prediction.keyword}</CardTitle>
                      <Badge className={`text-xs ${prediction.likelihood > 0.7 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {Math.round(prediction.likelihood * 100)}% likely
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          Expected peak: {new Date(prediction.estimated_peak_date).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{prediction.recommended_action}</span>
                      </div>

                      <div className="space-y-2">
                        <span className="text-sm font-medium">Content Suggestions:</span>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {prediction.content_suggestions.slice(0, 3).map((suggestion, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <ChevronRight className="w-3 h-3" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => generateContentFromTrend({
                          keyword: prediction.keyword,
                          platform: selectedPlatform,
                          category: 'business'
                        })}
                        className="w-full mt-3"
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                        Create Content Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {predictions.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Click "Generate Predictions" to see future trends.</p>
              </div>
            )}
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-4">
            {trendAnalysis ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Trend Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Trend Data */}
                      {trendAnalysis.trend && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              {trendAnalysis.trend.volume}%
                            </div>
                            <div className="text-sm text-gray-600">Volume</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              +{trendAnalysis.trend.growth_rate}%
                            </div>
                            <div className="text-sm text-gray-600">Growth</div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                              {trendAnalysis.trend.engagement_score}/10
                            </div>
                            <div className="text-sm text-gray-600">Engagement</div>
                          </div>
                          <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">
                              {trendAnalysis.trend.predicted_duration}
                            </div>
                            <div className="text-sm text-gray-600">Days</div>
                          </div>
                        </div>
                      )}

                      {/* Content Suggestions */}
                      {trendAnalysis.content_suggestions && (
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Content Suggestions:</h4>
                          <ul className="space-y-1">
                            {trendAnalysis.content_suggestions.map((suggestion, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm">
                                <Sparkles className="w-3 h-3 text-yellow-600" />
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Optimal Timing */}
                      {trendAnalysis.optimal_timing && (
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Optimal Timing:</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-green-600" />
                              <span>Best time to post: {new Date(trendAnalysis.optimal_timing.best_time_to_post).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-green-600" />
                              <span>Urgency: {trendAnalysis.optimal_timing.urgency_level}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-green-600" />
                              <span>{trendAnalysis.optimal_timing.recommendation}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Analysis Details */}
                      {trendAnalysis.analysis && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Detailed Analysis:</h4>
                          <div className="text-sm text-gray-700">
                            {typeof trendAnalysis.analysis === 'string' ? 
                              trendAnalysis.analysis : 
                              JSON.stringify(trendAnalysis.analysis, null, 2)
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Click "Analyze" on any trend to see detailed insights.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Loading State */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg flex items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              <span>Analyzing trends...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendsAnalyzer;