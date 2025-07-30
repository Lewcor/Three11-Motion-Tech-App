import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Mic, Users, Clock, Copy, FileText, Headphones, Plus, Minus, Zap } from 'lucide-react';
import { toast } from 'sonner';
import AIProviderSelector from './AIProviderSelector';
import axios from 'axios';

const PodcastContentGenerator = () => {
  const [podcastTitle, setPodcastTitle] = useState('');
  const [episodeNumber, setEpisodeNumber] = useState('');
  const [duration, setDuration] = useState(30);
  const [topics, setTopics] = useState(['']);
  const [guests, setGuests] = useState(['']);
  const [keyPoints, setKeyPoints] = useState(['']);
  const [contentType, setContentType] = useState('podcast_description');
  const [tone, setTone] = useState('professional');
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [podcastHistory, setPodcastHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API = `${BACKEND_URL}/api`;

  const contentTypes = [
    { 
      id: 'podcast_description', 
      name: 'Episode Description', 
      description: 'Compelling description for podcast platforms',
      icon: '📝'
    },
    { 
      id: 'podcast_show_notes', 
      name: 'Show Notes', 
      description: 'Detailed notes with timestamps and resources',
      icon: '📋'
    }
  ];

  const tones = [
    { id: 'professional', name: 'Professional', description: 'Formal and authoritative' },
    { id: 'casual', name: 'Casual', description: 'Relaxed and conversational' },
    { id: 'educational', name: 'Educational', description: 'Informative and instructive' },
    { id: 'entertaining', name: 'Entertaining', description: 'Fun and engaging' }
  ];

  useEffect(() => {
    fetchPodcastHistory();
    fetchAnalytics();
  }, []);

  const fetchPodcastHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/podcast/content`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPodcastHistory(response.data);
    } catch (error) {
      console.error('Error fetching podcast history:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/podcast/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const addItem = (items, setItems) => {
    setItems([...items, '']);
  };

  const removeItem = (items, setItems, index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (items, setItems, index, value) => {
    const updated = [...items];
    updated[index] = value;
    setItems(updated);
  };

  const handleGenerate = async () => {
    const validTopics = topics.filter(t => t.trim());
    const validKeyPoints = keyPoints.filter(k => k.trim());
    
    if (!podcastTitle.trim() || validTopics.length === 0 || selectedProviders.length === 0) {
      toast.error('Please fill required fields and select AI providers');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API}/podcast/content`, {
        podcast_title: podcastTitle,
        episode_number: episodeNumber ? parseInt(episodeNumber) : null,
        duration: duration,
        topics: validTopics,
        guests: guests.filter(g => g.trim()),
        key_points: validKeyPoints,
        content_type: contentType,
        tone: tone,
        include_timestamps: includeTimestamps,
        ai_providers: selectedProviders
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setResults(response.data);
      toast.success('Podcast content generated successfully!');
      fetchPodcastHistory();
      fetchAnalytics();
    } catch (error) {
      console.error('Error generating podcast content:', error);
      toast.error(error.response?.data?.detail || 'Failed to generate podcast content');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Podcast Content Generator
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Create compelling podcast descriptions and detailed show notes
        </p>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Content</TabsTrigger>
          <TabsTrigger value="history">Podcast History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-5 w-5" />
                    Podcast Details
                  </CardTitle>
                  <CardDescription>
                    Basic information about your podcast episode
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Podcast Title *</label>
                    <Input
                      placeholder="e.g., The Entrepreneur's Journey"
                      value={podcastTitle}
                      onChange={(e) => setPodcastTitle(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Episode Number</label>
                      <Input
                        type="number"
                        placeholder="e.g., 42"
                        value={episodeNumber}
                        onChange={(e) => setEpisodeNumber(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                      <Input
                        type="number"
                        min="5"
                        max="300"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                      />
                      <p className="text-xs text-gray-500 mt-1">{formatDuration(duration)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Topics & Content ({topics.filter(t => t.trim()).length})
                    </div>
                    <Button
                      onClick={() => addItem(topics, setTopics)}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topics.map((topic, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-medium text-indigo-600">
                        {index + 1}
                      </div>
                      <Input
                        placeholder={`Topic #${index + 1} - e.g., Building a startup from scratch`}
                        value={topic}
                        onChange={(e) => updateItem(topics, setTopics, index, e.target.value)}
                        className="flex-1"
                      />
                      {topics.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(topics, setTopics, index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Guests (Optional)
                    </div>
                    <Button
                      onClick={() => addItem(guests, setGuests)}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {guests.map((guest, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Guest ${index + 1} - e.g., John Smith, CEO of TechCorp`}
                        value={guest}
                        onChange={(e) => updateItem(guests, setGuests, index, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(guests, setGuests, index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Key Points</span>
                    <Button
                      onClick={() => addItem(keyPoints, setKeyPoints)}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {keyPoints.map((point, index) => (
                    <div key={index} className="flex gap-2">
                      <Textarea
                        placeholder={`Key point #${index + 1} - Important takeaway or insight discussed`}
                        value={point}
                        onChange={(e) => updateItem(keyPoints, setKeyPoints, index, e.target.value)}
                        rows={2}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(keyPoints, setKeyPoints, index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-3">Content Type</label>
                    <div className="grid grid-cols-1 gap-3">
                      {contentTypes.map((type) => (
                        <Button
                          key={type.id}
                          variant={contentType === type.id ? 'default' : 'outline'}
                          className="h-16 justify-start text-left"
                          onClick={() => setContentType(type.id)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{type.icon}</span>
                            <div>
                              <div className="font-medium">{type.name}</div>
                              <div className="text-xs opacity-70">{type.description}</div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Tone</label>
                    <div className="grid grid-cols-2 gap-3">
                      {tones.map((toneOption) => (
                        <Button
                          key={toneOption.id}
                          variant={tone === toneOption.id ? 'default' : 'outline'}
                          className="h-16 flex-col gap-1"
                          onClick={() => setTone(toneOption.id)}
                        >
                          <span className="font-medium">{toneOption.name}</span>
                          <span className="text-xs opacity-70">{toneOption.description}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {contentType === 'podcast_show_notes' && (
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
                        Include timestamps in show notes
                      </label>
                    </div>
                  )}
                </CardContent>
              </Card>

              <AIProviderSelector
                selectedProviders={selectedProviders}
                onProvidersChange={setSelectedProviders}
                disabled={loading}
              />

              <Button
                onClick={handleGenerate}
                disabled={loading || !podcastTitle.trim() || topics.filter(t => t.trim()).length === 0 || selectedProviders.length === 0}
                className="w-full h-12 text-lg"
                size="lg"
              >
                {loading ? (
                  <>
                    <Zap className="mr-2 h-5 w-5 animate-spin" />
                    Generating Content...
                  </>
                ) : (
                  <>
                    <Headphones className="mr-2 h-5 w-5" />
                    Generate Podcast Content
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
                      <Headphones className="h-5 w-5" />
                      Generated Content
                    </CardTitle>
                    <CardDescription>
                      {results.content_type === 'podcast_description' ? 'Episode Description' : 'Show Notes'} in {results.tone} tone
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {results.description && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">Episode Description</h3>
                          <Button
                            onClick={() => copyToClipboard(results.description)}
                            variant="outline"
                            size="sm"
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                          </Button>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm whitespace-pre-wrap">{results.description}</p>
                        </div>
                      </div>
                    )}

                    {results.show_notes && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">Show Notes</h3>
                          <Button
                            onClick={() => copyToClipboard(results.show_notes)}
                            variant="outline"
                            size="sm"
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                          </Button>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
                          <pre className="text-sm whitespace-pre-wrap font-sans">{results.show_notes}</pre>
                        </div>
                      </div>
                    )}

                    {results.chapters && results.chapters.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2">Chapters ({results.chapters.length})</h3>
                        <div className="space-y-2">
                          {results.chapters.map((chapter, index) => (
                            <div key={index} className="border rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  {chapter.timestamp}
                                </Badge>
                                <span className="font-medium text-sm">{chapter.title}</span>
                              </div>
                              <p className="text-xs text-gray-600">{chapter.summary}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {results.key_quotes && results.key_quotes.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2">Key Quotes ({results.key_quotes.length})</h3>
                        <div className="space-y-2">
                          {results.key_quotes.map((quote, index) => (
                            <div key={index} className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                              <p className="text-sm italic">"{quote}"</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {results.resources_mentioned && results.resources_mentioned.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2">Resources Mentioned ({results.resources_mentioned.length})</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {results.resources_mentioned.map((resource, index) => (
                            <li key={index} className="text-sm">{resource}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                    <Headphones className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>Your generated podcast content will appear here</p>
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
                Podcast Content History
              </CardTitle>
              <CardDescription>
                Your previously generated podcast content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {podcastHistory.length > 0 ? (
                <div className="space-y-4">
                  {podcastHistory.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{item.podcast_title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className="text-xs">
                            {item.content_type === 'podcast_description' ? 'Description' : 'Show Notes'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.tone}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Created: {new Date(item.created_at).toLocaleDateString()}
                      </p>
                      
                      <div className="flex gap-2">
                        {item.description && (
                          <Button
                            onClick={() => copyToClipboard(item.description)}
                            variant="outline"
                            size="sm"
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Description
                          </Button>
                        )}
                        {item.show_notes && (
                          <Button
                            onClick={() => copyToClipboard(item.show_notes)}
                            variant="outline"
                            size="sm"
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Show Notes
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Headphones className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No podcast content generated yet</p>
                  <p className="text-sm">Create your first podcast content to see it here!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {analytics?.total_episodes || 0}
                </div>
                <div className="text-sm text-gray-600">Total Episodes</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.keys(analytics?.content_types || {}).length}
                </div>
                <div className="text-sm text-gray-600">Content Types</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(analytics?.avg_duration || 0)}m
                </div>
                <div className="text-sm text-gray-600">Avg Duration</div>
              </CardContent>
            </Card>
          </div>

          {analytics?.content_types && Object.keys(analytics.content_types).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Content Types Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.content_types).map(([type, data]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="capitalize">{type.replace('_', ' ')}</span>
                      <Badge variant="outline">{data.count} episodes</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PodcastContentGenerator;