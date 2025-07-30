import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Video, Download, Copy, Clock, Play, Subtitles, FileText, Zap } from 'lucide-react';
import { toast } from 'sonner';
import AIProviderSelector from './AIProviderSelector';
import axios from 'axios';

const VideoContentGenerator = () => {
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoDuration, setVideoDuration] = useState(60);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [captionStyle, setCaptionStyle] = useState('engaging');
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [videoHistory, setVideoHistory] = useState([]);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API = `${BACKEND_URL}/api`;

  const categories = [
    { id: 'fashion', name: 'Fashion', icon: '👗' },
    { id: 'fitness', name: 'Fitness', icon: '💪' },
    { id: 'food', name: 'Food', icon: '🍽️' },
    { id: 'travel', name: 'Travel', icon: '✈️' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'gaming', name: 'Gaming', icon: '🎮' },
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'ideas', name: 'Ideas', icon: '💡' },
    { id: 'event_space', name: 'Event Space', icon: '🏛️' }
  ];

  const platforms = [
    { id: 'tiktok', name: 'TikTok', icon: '📱', color: 'bg-pink-500' },
    { id: 'instagram', name: 'Instagram', icon: '📷', color: 'bg-purple-500' },
    { id: 'youtube', name: 'YouTube', icon: '📺', color: 'bg-red-500' },
    { id: 'facebook', name: 'Facebook', icon: '👥', color: 'bg-blue-500' }
  ];

  const captionStyles = [
    { id: 'engaging', name: 'Engaging', description: 'Catchy and attention-grabbing' },
    { id: 'informative', name: 'Informative', description: 'Educational and detailed' },
    { id: 'storytelling', name: 'Storytelling', description: 'Narrative-driven' },
    { id: 'promotional', name: 'Promotional', description: 'Sales and marketing focused' }
  ];

  const languages = [
    { id: 'en', name: 'English' },
    { id: 'es', name: 'Spanish' },
    { id: 'fr', name: 'French' },
    { id: 'de', name: 'German' },
    { id: 'pt', name: 'Portuguese' }
  ];

  useEffect(() => {
    fetchVideoHistory();
  }, []);

  const fetchVideoHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/video/captions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVideoHistory(response.data);
    } catch (error) {
      console.error('Error fetching video history:', error);
    }
  };

  const handleGenerate = async () => {
    if (!videoTitle.trim() || !videoDescription.trim() || !selectedCategory || !selectedPlatform || selectedProviders.length === 0) {
      toast.error('Please fill all required fields and select AI providers');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API}/video/captions`, {
        video_title: videoTitle,
        video_description: videoDescription,
        video_duration: videoDuration,
        platform: selectedPlatform,
        category: selectedCategory,
        caption_style: captionStyle,
        include_timestamps: includeTimestamps,
        language: language,
        ai_providers: selectedProviders
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setResults(response.data);
      toast.success('Video captions generated successfully!');
      fetchVideoHistory();
    } catch (error) {
      console.error('Error generating video captions:', error);
      toast.error(error.response?.data?.detail || 'Failed to generate video captions');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadSRT = (srtContent) => {
    const blob = new Blob([srtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${videoTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('SRT file downloaded!');
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Video Content Generator
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Generate engaging captions and subtitles for your videos
        </p>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Captions</TabsTrigger>
          <TabsTrigger value="history">Caption History</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Video Details
                  </CardTitle>
                  <CardDescription>
                    Provide information about your video
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Video Title *</label>
                    <Input
                      placeholder="e.g., 10 Fashion Tips for Winter 2024"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Video Description *</label>
                    <Textarea
                      placeholder="Describe what your video is about, key points covered, target audience..."
                      value={videoDescription}
                      onChange={(e) => setVideoDescription(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Duration (seconds)</label>
                      <Input
                        type="number"
                        min="15"
                        max="3600"
                        value={videoDuration}
                        onChange={(e) => setVideoDuration(parseInt(e.target.value) || 60)}
                      />
                      <p className="text-xs text-gray-500 mt-1">{formatDuration(videoDuration)}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Language</label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      >
                        {languages.map(lang => (
                          <option key={lang.id} value={lang.id}>{lang.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category & Platform</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-3">Content Category *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? 'default' : 'outline'}
                          className="h-12 flex-col gap-1 text-xs"
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Target Platform *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {platforms.map((platform) => (
                        <Button
                          key={platform.id}
                          variant={selectedPlatform === platform.id ? 'default' : 'outline'}
                          className="h-14 flex-col gap-1"
                          onClick={() => setSelectedPlatform(platform.id)}
                        >
                          <span className="text-lg">{platform.icon}</span>
                          <span className="text-sm">{platform.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Caption Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-3">Caption Style</label>
                    <div className="grid grid-cols-2 gap-3">
                      {captionStyles.map((style) => (
                        <Button
                          key={style.id}
                          variant={captionStyle === style.id ? 'default' : 'outline'}
                          className="h-16 flex-col gap-1 text-xs"
                          onClick={() => setCaptionStyle(style.id)}
                        >
                          <span className="font-medium">{style.name}</span>
                          <span className="text-xs text-gray-600">{style.description}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="timestamps"
                      checked={includeTimestamps}
                      onChange={(e) => setIncludeTimestamps(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="timestamps" className="text-sm font-medium flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Include timestamps for SRT file
                    </label>
                  </div>
                </CardContent>
              </Card>

              <AIProviderSelector
                selectedProviders={selectedProviders}
                onProvidersChange={setSelectedProviders}
                disabled={loading}
              />

              <Button
                onClick={handleGenerate}
                disabled={loading || !videoTitle.trim() || !videoDescription.trim() || !selectedCategory || !selectedPlatform || selectedProviders.length === 0}
                className="w-full h-12 text-lg"
                size="lg"
              >
                {loading ? (
                  <>
                    <Zap className="mr-2 h-5 w-5 animate-spin" />
                    Generating Captions...
                  </>
                ) : (
                  <>
                    <Subtitles className="mr-2 h-5 w-5" />
                    Generate Video Captions
                  </>
                )}
              </Button>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {results ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Play className="h-5 w-5" />
                      Generated Captions
                    </CardTitle>
                    <CardDescription>
                      {results.captions?.length || 0} captions in {results.language} ({results.style})
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {results.subtitle_file && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => downloadSRT(results.subtitle_file)}
                          size="sm"
                          className="flex-1"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download SRT
                        </Button>
                        <Button
                          onClick={() => copyToClipboard(results.subtitle_file)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy SRT
                        </Button>
                      </div>
                    )}

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {results.captions?.map((caption, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {caption.timestamp}
                              </Badge>
                              <Badge className="text-xs bg-blue-100 text-blue-700">
                                {caption.provider}
                              </Badge>
                            </div>
                            <Button
                              onClick={() => copyToClipboard(caption.text)}
                              variant="ghost"
                              size="sm"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm">{caption.text}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                    <Video className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>Your generated captions will appear here</p>
                    <p className="text-sm">Fill in the details and click generate to start</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Caption History
              </CardTitle>
              <CardDescription>
                Your previously generated video captions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {videoHistory.length > 0 ? (
                <div className="space-y-4">
                  {videoHistory.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium truncate">{item.video_title || 'Untitled Video'}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className="text-xs bg-gray-100 text-gray-700">
                            {item.captions?.length || 0} captions
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.language}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Style: {item.style} • Created: {new Date(item.created_at).toLocaleDateString()}
                      </p>
                      
                      {item.subtitle_file && (
                        <Button
                          onClick={() => downloadSRT(item.subtitle_file)}
                          variant="outline"
                          size="sm"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download SRT
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Video className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No video captions generated yet</p>
                  <p className="text-sm">Create your first video captions to see them here!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VideoContentGenerator;