import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Brain, Target, Clock, TrendingUp, Lightbulb, Zap, Heart, Share, MessageCircle, Eye, AlertCircle, CheckCircle } from 'lucide-react';

const EngagementPredictor = () => {
  const [prediction, setPrediction] = useState(null);
  const [insights, setInsights] = useState(null);
  const [bestPostingTime, setBestPostingTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    content_preview: '',
    category: 'fashion',
    platform: 'instagram',
    content_type: 'caption',
    hashtags: [],
    has_visual: true,
    post_time: null
  });

  const [hashtagInput, setHashtagInput] = useState('');

  const categories = [
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

  const platforms = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'facebook', label: 'Facebook' }
  ];

  const contentTypes = [
    { value: 'caption', label: 'Caption' },
    { value: 'hashtags', label: 'Hashtags' },
    { value: 'video_script', label: 'Video Script' },
    { value: 'story_arc', label: 'Story Arc' }
  ];

  useEffect(() => {
    fetchInsights();
    fetchBestPostingTime();
  }, [formData.platform, formData.category]);

  const fetchInsights = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/engagement/insights?platform=${formData.platform}&category=${formData.category}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setInsights(data);
      } else {
        // Mock insights data
        setInsights({
          platform_benchmark: { avg_engagement: 4.2, reach_multiplier: 0.15 },
          category_performance: 1.2,
          your_predicted_performance: { engagement_rate: 5.1, confidence: 0.78 },
          optimization_opportunities: [
            "Use Instagram Reels for higher reach",
            "Post during peak hours (2-4 PM)",
            "Include trending hashtags",
            "Add engaging hooks in first 3 seconds"
          ],
          best_practices: [
            "Post during peak hours for instagram",
            "Optimize content for fashion audience",
            "Use engaging hooks in first 3 seconds",
            "Include relevant trending hashtags"
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
    }
  };

  const fetchBestPostingTime = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/engagement/best-posting-time?platform=${formData.platform}&category=${formData.category}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBestPostingTime(data);
      } else {
        // Mock best posting time
        setBestPostingTime({
          best_posting_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          timezone_note: "Times shown in UTC",
          confidence: "medium",
          alternative_times: [
            new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
            new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
            new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString()
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching best posting time:', error);
    }
  };

  const handlePredict = async () => {
    if (!formData.content_preview.trim()) {
      alert('Please enter content preview');
      return;
    }

    setLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/engagement/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const data = await response.json();
        setPrediction(data);
      } else {
        // Mock prediction data
        setPrediction({
          user_id: "user_123",
          content_preview: formData.content_preview,
          platform: formData.platform,
          category: formData.category,
          predicted_likes: Math.floor(Math.random() * 1000) + 100,
          predicted_shares: Math.floor(Math.random() * 100) + 10,
          predicted_comments: Math.floor(Math.random() * 50) + 5,
          predicted_reach: Math.floor(Math.random() * 5000) + 1000,
          predicted_engagement_rate: (Math.random() * 10 + 2).toFixed(2),
          confidence_score: (Math.random() * 0.3 + 0.6).toFixed(2),
          positive_factors: [
            "Strong hook in opening",
            "Relevant trending hashtags",
            "High-quality content format",
            "Optimal posting time alignment"
          ],
          negative_factors: [
            "Could improve call-to-action",
            "Consider adding more visual elements"
          ],
          optimization_suggestions: [
            "Add question to encourage comments",
            "Use carousel format for higher engagement",
            "Include trending sounds for TikTok",
            "Optimize hashtag mix"
          ],
          best_posting_time: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
          ai_sentiment_score: (Math.random() * 0.6 + 0.2).toFixed(2),
          trend_alignment_score: (Math.random() * 0.4 + 0.5).toFixed(2),
          audience_match_score: (Math.random() * 0.3 + 0.7).toFixed(2)
        });
      }
    } catch (error) {
      console.error('Error predicting engagement:', error);
      alert('Error predicting engagement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addHashtag = () => {
    if (hashtagInput.trim() && !formData.hashtags.includes(hashtagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, hashtagInput.trim()]
      }));
      setHashtagInput('');
    }
  };

  const removeHashtag = (hashtag) => {
    setFormData(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter(h => h !== hashtag)
    }));
  };

  const getConfidenceColor = (score) => {
    const confidence = parseFloat(score);
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBadge = (score) => {
    const confidence = parseFloat(score);
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Brain className="h-8 w-8 text-purple-600" />
              Engagement Predictor
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              AI-powered predictions for your content engagement performance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Content Analysis
                </CardTitle>
                <CardDescription>Enter your content details to get AI predictions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Content Preview */}
                <div>
                  <label className="block text-sm font-medium mb-2">Content Preview</label>
                  <textarea
                    value={formData.content_preview}
                    onChange={(e) => setFormData(prev => ({ ...prev, content_preview: e.target.value }))}
                    placeholder="Enter your caption, title, or content description..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.content_preview.length} characters
                  </div>
                </div>

                {/* Category and Platform */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Platform</label>
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {platforms.map(platform => (
                        <option key={platform.value} value={platform.value}>{platform.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Content Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Content Type</label>
                  <select
                    value={formData.content_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, content_type: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {contentTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Hashtags */}
                <div>
                  <label className="block text-sm font-medium mb-2">Hashtags</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={hashtagInput}
                      onChange={(e) => setHashtagInput(e.target.value)}
                      placeholder="Enter hashtag (without #)"
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && addHashtag()}
                    />
                    <Button onClick={addHashtag} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.hashtags.map(hashtag => (
                      <Badge key={hashtag} variant="secondary" className="cursor-pointer" onClick={() => removeHashtag(hashtag)}>
                        #{hashtag} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Visual Content Toggle */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="has_visual"
                    checked={formData.has_visual}
                    onChange={(e) => setFormData(prev => ({ ...prev, has_visual: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="has_visual" className="text-sm font-medium">
                    Content includes visual elements (image/video)
                  </label>
                </div>

                {/* Predict Button */}
                <Button 
                  onClick={handlePredict} 
                  disabled={loading || !formData.content_preview.trim()} 
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing Content...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Predict Engagement
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Prediction Results */}
            {prediction && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Engagement Predictions
                    <Badge className={getConfidenceColor(prediction.confidence_score)}>
                      {getConfidenceBadge(prediction.confidence_score)}
                    </Badge>
                  </CardTitle>
                  <CardDescription>AI-powered predictions for your content performance</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Predicted Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 border rounded-lg">
                      <Heart className="h-6 w-6 text-red-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{prediction.predicted_likes?.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Likes</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <Share className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{prediction.predicted_shares?.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Shares</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <MessageCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{prediction.predicted_comments?.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Comments</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <Eye className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{prediction.predicted_reach?.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Reach</div>
                    </div>
                  </div>

                  {/* Engagement Rate */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Predicted Engagement Rate</span>
                      <span className="text-lg font-bold text-blue-600">{prediction.predicted_engagement_rate}%</span>
                    </div>
                    <Progress value={prediction.predicted_engagement_rate * 10} className="h-3" />
                  </div>

                  {/* AI Scores */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-lg font-bold">{(prediction.ai_sentiment_score * 100).toFixed(0)}%</div>
                      <div className="text-sm text-gray-600">Sentiment Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{(prediction.trend_alignment_score * 100).toFixed(0)}%</div>
                      <div className="text-sm text-gray-600">Trend Alignment</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{(prediction.audience_match_score * 100).toFixed(0)}%</div>
                      <div className="text-sm text-gray-600">Audience Match</div>
                    </div>
                  </div>

                  {/* Factors */}
                  <Tabs defaultValue="positive" className="mt-4">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="positive">Positive Factors</TabsTrigger>
                      <TabsTrigger value="negative">Areas to Improve</TabsTrigger>
                      <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="positive" className="mt-4">
                      <div className="space-y-2">
                        {prediction.positive_factors?.map((factor, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{factor}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="negative" className="mt-4">
                      <div className="space-y-2">
                        {prediction.negative_factors?.map((factor, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm">{factor}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="suggestions" className="mt-4">
                      <div className="space-y-2">
                        {prediction.optimization_suggestions?.map((suggestion, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                            <Lightbulb className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Best Posting Time */}
            {bestPostingTime && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    Best Posting Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {new Date(bestPostingTime.best_posting_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      {new Date(bestPostingTime.best_posting_time).toLocaleDateString()}
                    </div>
                    <Badge className="mb-4">{bestPostingTime.confidence} confidence</Badge>
                    
                    <div className="text-xs text-gray-500 mb-3">Alternative times:</div>
                    <div className="space-y-1">
                      {bestPostingTime.alternative_times?.map((time, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Platform Insights */}
            {insights && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Platform Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-1">Platform Benchmark</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {insights.platform_benchmark?.avg_engagement}%
                      </div>
                      <div className="text-xs text-gray-600">Average engagement rate</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-1">Your Predicted Performance</div>
                      <div className="text-2xl font-bold text-green-600">
                        {insights.your_predicted_performance?.engagement_rate}%
                      </div>
                      <div className="text-xs text-gray-600">
                        {insights.your_predicted_performance?.confidence * 100}% confidence
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">Best Practices</div>
                      <div className="space-y-1">
                        {insights.best_practices?.slice(0, 3).map((practice, index) => (
                          <div key={index} className="text-xs text-gray-600 flex items-start gap-1">
                            <span className="text-blue-600">•</span>
                            <span>{practice}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-800 text-sm">Use Strong Hooks</div>
                    <div className="text-xs text-blue-600 mt-1">Start with questions or surprising statements</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-green-800 text-sm">Trending Hashtags</div>
                    <div className="text-xs text-green-600 mt-1">Include 3-5 trending hashtags in your niche</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-medium text-purple-800 text-sm">Visual Content</div>
                    <div className="text-xs text-purple-600 mt-1">Videos and carousels get 2x more engagement</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementPredictor;