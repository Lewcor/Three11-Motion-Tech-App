import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Lightbulb, Video, FileText, Zap, TrendingUp, Target, 
  Copy, Sparkles, Clock, Users, BarChart3, Calendar,
  Brain, Megaphone, Eye, MousePointer, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { mockData } from '../mock';
import axios from 'axios';

const ContentCreationPage = () => {
  const [activeTab, setActiveTab] = useState('ideas');
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [results, setResults] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API = `${BACKEND_URL}/api`;

  const contentTypes = [
    { id: 'ideas', name: 'Content Ideas', icon: <Lightbulb className="h-5 w-5" />, color: 'bg-yellow-500' },
    { id: 'video-script', name: 'Video Scripts', icon: <Video className="h-5 w-5" />, color: 'bg-red-500' },
    { id: 'hooks', name: 'Hooks', icon: <Eye className="h-5 w-5" />, color: 'bg-green-500' },
    { id: 'cta', name: 'Call-to-Actions', icon: <MousePointer className="h-5 w-5" />, color: 'bg-blue-500' },
    { id: 'strategy', name: 'Content Strategy', icon: <BarChart3 className="h-5 w-5" />, color: 'bg-purple-500' },
    { id: 'trending', name: 'Trending Topics', icon: <TrendingUp className="h-5 w-5" />, color: 'bg-orange-500' },
    { id: 'calendar', name: 'Content Calendar', icon: <Calendar className="h-5 w-5" />, color: 'bg-indigo-500' }
  ];

  const contentTemplates = [
    { id: 'educational', name: 'Educational' },
    { id: 'entertaining', name: 'Entertaining' },
    { id: 'promotional', name: 'Promotional' },
    { id: 'inspirational', name: 'Inspirational' },
    { id: 'tutorial', name: 'Tutorial' },
    { id: 'behind_scenes', name: 'Behind the Scenes' },
    { id: 'user_generated', name: 'User Generated' },
    { id: 'seasonal', name: 'Seasonal' }
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleContentGeneration = async (type, data) => {
    setLoading(true);
    setResults(null);
    
    try {
      let response;
      const userId = 'demo-user-123'; // In production, get from auth context
      
      switch (type) {
        case 'ideas':
          response = await axios.post(`${API}/content/ideas`, {
            user_id: userId,
            category: selectedCategory,
            platform: selectedPlatform,
            content_type: 'content_idea',
            template: data.template || null,
            quantity: data.quantity || 5,
            audience_focus: data.audienceFocus || null
          });
          break;
          
        case 'video-script':
          response = await axios.post(`${API}/content/video-script`, {
            user_id: userId,
            category: selectedCategory,
            platform: selectedPlatform,
            topic: data.topic,
            duration: data.duration || 60,
            style: data.style || 'educational'
          });
          break;
          
        case 'hooks':
          response = await axios.post(`${API}/content/hooks`, null, {
            params: {
              topic: data.topic,
              platform: selectedPlatform,
              quantity: data.quantity || 5
            }
          });
          break;
          
        case 'cta':
          response = await axios.post(`${API}/content/cta`, null, {
            params: {
              goal: data.goal,
              platform: selectedPlatform,
              quantity: data.quantity || 3
            }
          });
          break;
          
        case 'strategy':
          response = await axios.post(`${API}/content/strategy`, {
            user_id: userId,
            category: selectedCategory,
            platform: selectedPlatform,
            audience_size: data.audienceSize || null,
            posting_frequency: data.postingFrequency || 7,
            goals: data.goals || []
          });
          break;
          
        case 'trending':
          response = await axios.get(`${API}/content/trending/${selectedCategory}/${selectedPlatform}`);
          break;
          
        default:
          throw new Error('Unknown content type');
      }
      
      setResults(response.data);
      toast.success('Content generated successfully by THREE11 MOTION TECH!');
      
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const ContentIdeasTab = () => {
    const [template, setTemplate] = useState('');
    const [quantity, setQuantity] = useState(5);
    const [audienceFocus, setAudienceFocus] = useState('');

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Content Ideas Generator
            </CardTitle>
            <CardDescription>
              Generate viral content ideas tailored to your niche and platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Content Template</label>
                <Select value={template} onValueChange={setTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTemplates.map(temp => (
                      <SelectItem key={temp.id} value={temp.id}>{temp.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Number of Ideas</label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min="1"
                  max="10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Audience Focus (Optional)</label>
              <Input
                placeholder="e.g., young entrepreneurs, fitness beginners, fashion enthusiasts"
                value={audienceFocus}
                onChange={(e) => setAudienceFocus(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={() => handleContentGeneration('ideas', { template, quantity, audienceFocus })}
              disabled={loading || !selectedCategory || !selectedPlatform}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Ideas...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Content Ideas
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        
        {results && results.ideas && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Content Ideas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.ideas.map((idea, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <p className="text-sm flex-1">{idea}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(idea)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {results.trending_topics && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Trending Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {results.trending_topics.map((topic, index) => (
                      <Badge key={index} variant="secondary">{topic}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const VideoScriptTab = () => {
    const [topic, setTopic] = useState('');
    const [duration, setDuration] = useState(60);
    const [style, setStyle] = useState('educational');

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-red-500" />
              Video Script Generator
            </CardTitle>
            <CardDescription>
              Create compelling video scripts with hooks, content, and CTAs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Video Topic</label>
              <Input
                placeholder="e.g., 5 productivity tips for entrepreneurs"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Duration (seconds)</label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min="15"
                  max="300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Style</label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTemplates.map(temp => (
                      <SelectItem key={temp.id} value={temp.id}>{temp.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              onClick={() => handleContentGeneration('video-script', { topic, duration, style })}
              disabled={loading || !selectedCategory || !selectedPlatform || !topic}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Script...
                </>
              ) : (
                <>
                  <Video className="mr-2 h-4 w-4" />
                  Generate Video Script
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        
        {results && results.hook && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Video Script</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-green-500 bg-green-50">
                  <h4 className="font-medium text-green-800 mb-2">Hook (0-3s)</h4>
                  <p className="text-sm text-green-700">{results.hook}</p>
                </div>
                
                <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                  <h4 className="font-medium text-blue-800 mb-2">Main Content</h4>
                  <p className="text-sm text-blue-700 whitespace-pre-line">{results.main_content}</p>
                </div>
                
                <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                  <h4 className="font-medium text-purple-800 mb-2">Call-to-Action</h4>
                  <p className="text-sm text-purple-700">{results.call_to_action}</p>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Timestamps</h4>
                  <div className="space-y-2">
                    {results.timestamps?.map((timestamp, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Badge variant="outline">{timestamp.time}</Badge>
                        <span>{timestamp.content}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const TrendingTab = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              Trending Topics
            </CardTitle>
            <CardDescription>
              Discover what's trending in your niche right now
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => handleContentGeneration('trending', {})}
              disabled={loading || !selectedCategory || !selectedPlatform}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finding Trends...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Get Trending Topics
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        
        {results && results.trending_topics && (
          <Card>
            <CardHeader>
              <CardTitle>Current Trending Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.trending_topics.map((topic, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{topic}</p>
                        <p className="text-sm text-gray-500 mt-1">Trending now</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(topic)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Content Creation Suite
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Complete content creation toolkit powered by THREE11 MOTION TECH
        </p>
      </div>

      {/* Category and Platform Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Select Category</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Choose content category" />
              </SelectTrigger>
              <SelectContent>
                {mockData.contentCategories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Select Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Choose platform" />
              </SelectTrigger>
              <SelectContent>
                {mockData.platforms.map(platform => (
                  <SelectItem key={platform.id} value={platform.id}>
                    {platform.icon} {platform.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Content Creation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 mb-8">
          {contentTypes.map(type => (
            <TabsTrigger 
              key={type.id} 
              value={type.id}
              className="flex items-center gap-2 text-xs lg:text-sm"
            >
              {type.icon}
              <span className="hidden lg:inline">{type.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="ideas">
          <ContentIdeasTab />
        </TabsContent>
        
        <TabsContent value="video-script">
          <VideoScriptTab />
        </TabsContent>
        
        <TabsContent value="trending">
          <TrendingTab />
        </TabsContent>
        
        <TabsContent value="hooks">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <Eye className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Hook Generator</h3>
                <p className="text-gray-600">Coming soon - Generate attention-grabbing hooks</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cta">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <MousePointer className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">CTA Generator</h3>
                <p className="text-gray-600">Coming soon - Generate compelling calls-to-action</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="strategy">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Content Strategy</h3>
                <p className="text-gray-600">Premium Feature - Comprehensive content planning</p>
                <Badge className="mt-2">Premium Only</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Content Calendar</h3>
                <p className="text-gray-600">Coming soon - Plan and schedule your content</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentCreationPage;