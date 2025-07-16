import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Shuffle, 
  ArrowRight, 
  Copy, 
  Sparkles, 
  Target, 
  BarChart3,
  RefreshCw,
  Zap,
  TrendingUp,
  Users,
  Heart,
  Share2,
  MessageSquare,
  PlayCircle,
  Image,
  Video,
  Settings,
  Download,
  Star,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Layers,
  Palette,
  Wand2
} from 'lucide-react';

const ContentRemixEngine = () => {
  const [originalContent, setOriginalContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('business');
  const [activeTab, setActiveTab] = useState('platform-adapt');
  const [isLoading, setIsLoading] = useState(false);
  const [remixResults, setRemixResults] = useState(null);
  const [variations, setVariations] = useState([]);
  const [crossPlatformSuite, setCrossPlatformSuite] = useState(null);
  const [userRemixes, setUserRemixes] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedSourcePlatform, setSelectedSourcePlatform] = useState('instagram');
  const [selectedTargetPlatform, setSelectedTargetPlatform] = useState('tiktok');
  const [selectedVariationPlatform, setSelectedVariationPlatform] = useState('instagram');
  const [variationCount, setVariationCount] = useState(5);

  const platforms = [
    { value: 'tiktok', label: 'TikTok', icon: '📱', color: 'text-black' },
    { value: 'instagram', label: 'Instagram', icon: '📸', color: 'text-pink-500' },
    { value: 'youtube', label: 'YouTube', icon: '📺', color: 'text-red-500' },
    { value: 'facebook', label: 'Facebook', icon: '👥', color: 'text-blue-500' }
  ];

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

  const variationTypes = [
    { type: 'casual', label: 'Casual & Friendly', color: 'bg-green-100 text-green-800' },
    { type: 'professional', label: 'Professional', color: 'bg-blue-100 text-blue-800' },
    { type: 'humorous', label: 'Humorous', color: 'bg-yellow-100 text-yellow-800' },
    { type: 'inspirational', label: 'Inspirational', color: 'bg-purple-100 text-purple-800' },
    { type: 'educational', label: 'Educational', color: 'bg-indigo-100 text-indigo-800' },
    { type: 'trendy', label: 'Trendy', color: 'bg-pink-100 text-pink-800' },
    { type: 'emotional', label: 'Emotional', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    fetchUserRemixes();
    fetchAnalytics();
  }, []);

  const fetchUserRemixes = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      
      const response = await fetch(`${backendUrl}/api/remix/user-remixes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserRemixes(data.remixes || []);
      }
    } catch (error) {
      console.error('Error fetching user remixes:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      
      const response = await fetch(`${backendUrl}/api/remix/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics || null);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handlePlatformRemix = async () => {
    if (!originalContent.trim()) {
      alert('Please enter content to remix');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      
      const response = await fetch(`${backendUrl}/api/remix/platform-adapt`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: originalContent,
          source_platform: selectedSourcePlatform,
          target_platform: selectedTargetPlatform,
          category: selectedCategory
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRemixResults(data);
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error remixing content:', error);
      alert('Error remixing content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateVariations = async () => {
    if (!originalContent.trim()) {
      alert('Please enter content to generate variations');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      
      const response = await fetch(`${backendUrl}/api/remix/generate-variations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: originalContent,
          platform: selectedVariationPlatform,
          category: selectedCategory,
          variation_count: variationCount
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setVariations(data.variations || []);
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error generating variations:', error);
      alert('Error generating variations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCrossPlatformSuite = async () => {
    if (!originalContent.trim()) {
      alert('Please enter content to generate cross-platform suite');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      
      const response = await fetch(`${backendUrl}/api/remix/cross-platform-suite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: originalContent,
          category: selectedCategory
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCrossPlatformSuite(data.suite);
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error generating cross-platform suite:', error);
      alert('Error generating cross-platform suite');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getPlatformIcon = (platform) => {
    const platformData = platforms.find(p => p.value === platform);
    return platformData ? platformData.icon : '📱';
  };

  const getPlatformColor = (platform) => {
    const platformData = platforms.find(p => p.value === platform);
    return platformData ? platformData.color : 'text-gray-500';
  };

  const getEngagementColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getVariationTypeStyle = (type) => {
    const typeData = variationTypes.find(v => v.type === type);
    return typeData ? typeData.color : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            <Shuffle className="inline mr-2 text-indigo-600" />
            Smart Content Remix Engine
          </h1>
          <p className="text-gray-600">Transform content across platforms with AI-powered optimization</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wand2 className="mr-2 text-indigo-600" />
                  Content Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Original Content</label>
                  <Textarea
                    placeholder="Enter your content here..."
                    value={originalContent}
                    onChange={(e) => setOriginalContent(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
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

                {/* Processing Status */}
                {isLoading && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                      <span className="text-sm text-blue-700">Processing content...</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="platform-adapt">Platform Adapt</TabsTrigger>
                <TabsTrigger value="variations">Variations</TabsTrigger>
                <TabsTrigger value="cross-platform">Cross-Platform</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              {/* Platform Adaptation Tab */}
              <TabsContent value="platform-adapt" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ArrowRight className="mr-2 text-indigo-600" />
                      Platform Adaptation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Source Platform</label>
                          <Select value={selectedSourcePlatform} onValueChange={setSelectedSourcePlatform}>
                            <SelectTrigger>
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

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Target Platform</label>
                          <Select value={selectedTargetPlatform} onValueChange={setSelectedTargetPlatform}>
                            <SelectTrigger>
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
                      </div>

                      <Button 
                        onClick={handlePlatformRemix} 
                        disabled={isLoading || !originalContent.trim()}
                        className="w-full"
                      >
                        <Shuffle className="mr-2 w-4 h-4" />
                        Remix for Platform
                      </Button>

                      {/* Remix Results */}
                      {remixResults && (
                        <div className="space-y-4">
                          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 flex items-center">
                              <Target className="w-4 h-4 mr-2" />
                              Remixed Content
                            </h4>
                            <p className="text-gray-800 mb-3">{remixResults.remixed_content}</p>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-2xl ${getPlatformColor(remixResults.original_platform)}`}>
                                {getPlatformIcon(remixResults.original_platform)}
                              </span>
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                              <span className={`text-2xl ${getPlatformColor(remixResults.target_platform)}`}>
                                {getPlatformIcon(remixResults.target_platform)}
                              </span>
                            </div>
                            <Button
                              onClick={() => copyToClipboard(remixResults.remixed_content)}
                              variant="ghost"
                              size="sm"
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </Button>
                          </div>

                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Adaptation Notes</h4>
                            <p className="text-sm text-gray-700">{remixResults.adaptation_notes}</p>
                          </div>

                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 flex items-center">
                              <BarChart3 className="w-4 h-4 mr-2" />
                              Engagement Prediction
                            </h4>
                            <div className="flex items-center gap-2">
                              <Progress value={remixResults.engagement_prediction * 10} className="flex-1" />
                              <span className={`font-semibold ${getEngagementColor(remixResults.engagement_prediction)}`}>
                                {remixResults.engagement_prediction.toFixed(1)}/10
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Variations Tab */}
              <TabsContent value="variations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Layers className="mr-2 text-indigo-600" />
                      Content Variations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Platform</label>
                          <Select value={selectedVariationPlatform} onValueChange={setSelectedVariationPlatform}>
                            <SelectTrigger>
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

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Number of Variations</label>
                          <Select value={variationCount.toString()} onValueChange={(value) => setVariationCount(parseInt(value))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3 variations</SelectItem>
                              <SelectItem value="5">5 variations</SelectItem>
                              <SelectItem value="7">7 variations</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button 
                        onClick={handleGenerateVariations} 
                        disabled={isLoading || !originalContent.trim()}
                        className="w-full"
                      >
                        <Palette className="mr-2 w-4 h-4" />
                        Generate Variations
                      </Button>

                      {/* Variations Results */}
                      {variations.length > 0 && (
                        <div className="space-y-4">
                          {variations.map((variation, index) => (
                            <Card key={index} className="border-l-4 border-indigo-400">
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <Badge className={getVariationTypeStyle(variation.variation_type)}>
                                    {variation.variation_type}
                                  </Badge>
                                  <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    <span className="text-sm">{variation.engagement_score.toFixed(1)}/10</span>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-gray-800 mb-3">{variation.variation_content}</p>
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                  <span><strong>Tone:</strong> {variation.tone}</span>
                                  <Button
                                    onClick={() => copyToClipboard(variation.variation_content)}
                                    variant="ghost"
                                    size="sm"
                                  >
                                    <Copy className="w-4 h-4 mr-1" />
                                    Copy
                                  </Button>
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  <strong>Audience:</strong> {variation.target_audience}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Cross-Platform Tab */}
              <TabsContent value="cross-platform" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="mr-2 text-indigo-600" />
                      Cross-Platform Suite
                    </CardTitle>
                    <CardDescription>
                      Generate optimized content for all platforms at once
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button 
                        onClick={handleCrossPlatformSuite} 
                        disabled={isLoading || !originalContent.trim()}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      >
                        <Sparkles className="mr-2 w-4 h-4" />
                        Generate Complete Suite
                      </Button>

                      {/* Cross-Platform Results */}
                      {crossPlatformSuite && (
                        <div className="space-y-4">
                          {/* Platform Adaptations */}
                          <div className="space-y-3">
                            <h4 className="font-semibold">Platform Adaptations</h4>
                            {Object.entries(crossPlatformSuite.platform_adaptations).map(([platform, data]) => (
                              <Card key={platform} className="border-l-4 border-purple-400">
                                <CardHeader className="pb-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className={`text-xl ${getPlatformColor(platform)}`}>
                                        {getPlatformIcon(platform)}
                                      </span>
                                      <span className="font-medium capitalize">{platform}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Progress value={data.engagement_prediction * 10} className="w-20" />
                                      <span className="text-sm">{data.engagement_prediction.toFixed(1)}/10</span>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-gray-800 mb-2">{data.content}</p>
                                  <p className="text-sm text-gray-600 mb-2">{data.adaptation_notes}</p>
                                  <Button
                                    onClick={() => copyToClipboard(data.content)}
                                    variant="ghost"
                                    size="sm"
                                  >
                                    <Copy className="w-4 h-4 mr-1" />
                                    Copy
                                  </Button>
                                </CardContent>
                              </Card>
                            ))}
                          </div>

                          {/* Content Variations */}
                          {crossPlatformSuite.content_variations && crossPlatformSuite.content_variations.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="font-semibold">Content Variations</h4>
                              {crossPlatformSuite.content_variations.map((variation, index) => (
                                <Card key={index} className="border-l-4 border-green-400">
                                  <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                      <Badge className={getVariationTypeStyle(variation.type)}>
                                        {variation.type}
                                      </Badge>
                                      <span className="text-sm">{variation.engagement_score.toFixed(1)}/10</span>
                                    </div>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-gray-800 mb-2">{variation.content}</p>
                                    <div className="text-sm text-gray-600">
                                      <strong>Tone:</strong> {variation.tone} | <strong>Audience:</strong> {variation.audience}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}

                          {/* Optimization Suggestions */}
                          {crossPlatformSuite.optimization_suggestions && crossPlatformSuite.optimization_suggestions.length > 0 && (
                            <div className="bg-yellow-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-2">Optimization Suggestions</h4>
                              <ul className="space-y-1">
                                {crossPlatformSuite.optimization_suggestions.map((suggestion, index) => (
                                  <li key={index} className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="w-3 h-3 text-yellow-600" />
                                    {suggestion}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Analytics Overview */}
                  {analytics && (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <BarChart3 className="mr-2 text-indigo-600" />
                            Usage Statistics
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">
                                {analytics.total_remixes}
                              </div>
                              <div className="text-sm text-gray-600">Total Remixes</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                              <div className="text-2xl font-bold text-green-600">
                                {analytics.avg_engagement_prediction?.toFixed(1) || 0}/10
                              </div>
                              <div className="text-sm text-gray-600">Avg Engagement</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Popular Platforms</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {Object.entries(analytics.platforms || {}).map(([platform, count]) => (
                              <div key={platform} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className={`text-lg ${getPlatformColor(platform)}`}>
                                    {getPlatformIcon(platform)}
                                  </span>
                                  <span className="capitalize">{platform}</span>
                                </div>
                                <Badge variant="secondary">{count}</Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}

                  {/* Recent Remixes */}
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Recent Remixes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {userRemixes.length > 0 ? (
                          userRemixes.slice(0, 5).map((remix, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <p className="text-sm font-medium truncate">{remix.original_content}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                                  <Badge variant="outline">{remix.category}</Badge>
                                  <span>{remix.platform_count} platforms</span>
                                  <span>{remix.variation_count} variations</span>
                                </div>
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(remix.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Shuffle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p>No remixes yet. Start by creating your first remix!</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg flex items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
              <span>Processing your content...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentRemixEngine;