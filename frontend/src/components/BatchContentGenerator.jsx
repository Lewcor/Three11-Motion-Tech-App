import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Minus, Play, Pause, Download, Eye, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import AIProviderSelector from './AIProviderSelector';
import axios from 'axios';

const BatchContentGenerator = () => {
  const [batchName, setBatchName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [contentItems, setContentItems] = useState(['']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [batches, setBatches] = useState([]);
  const [activeBatch, setActiveBatch] = useState(null);
  const [loading, setLoading] = useState(false);

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
    { id: 'tiktok', name: 'TikTok', icon: '📱' },
    { id: 'instagram', name: 'Instagram', icon: '📷' },
    { id: 'youtube', name: 'YouTube', icon: '📺' },
    { id: 'facebook', name: 'Facebook', icon: '👥' }
  ];

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/batch`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBatches(response.data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const addContentItem = () => {
    if (contentItems.length < 50) {
      setContentItems([...contentItems, '']);
    } else {
      toast.error('Maximum 50 content items per batch');
    }
  };

  const removeContentItem = (index) => {
    if (contentItems.length > 1) {
      setContentItems(contentItems.filter((_, i) => i !== index));
    }
  };

  const updateContentItem = (index, value) => {
    const updated = [...contentItems];
    updated[index] = value;
    setContentItems(updated);
  };

  const handleBatchGenerate = async () => {
    if (!selectedCategory || !selectedPlatform || selectedProviders.length === 0) {
      toast.error('Please select category, platform, and AI providers');
      return;
    }

    const validItems = contentItems.filter(item => item.trim());
    if (validItems.length === 0) {
      toast.error('Please add at least one content description');
      return;
    }

    setIsGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API}/batch/generate`, {
        category: selectedCategory,
        platform: selectedPlatform,
        content_descriptions: validItems,
        ai_providers: selectedProviders,
        batch_name: batchName || `Batch ${new Date().toLocaleDateString()}`
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(`Batch generation started! Processing ${validItems.length} items with ${selectedProviders.length} AI models.`);
      setActiveBatch(response.data);
      fetchBatches();
      
      // Poll for status updates
      pollBatchStatus(response.data.id);
      
    } catch (error) {
      console.error('Error starting batch generation:', error);
      toast.error(error.response?.data?.detail || 'Failed to start batch generation');
    } finally {
      setIsGenerating(false);
    }
  };

  const pollBatchStatus = async (batchId) => {
    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API}/batch/${batchId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const batch = response.data;
        setActiveBatch(batch);
        
        if (['completed', 'failed', 'cancelled', 'partially_completed'].includes(batch.status)) {
          clearInterval(interval);
          fetchBatches();
          
          if (batch.status === 'completed') {
            toast.success(`Batch completed! ${batch.completed_items} items generated successfully.`);
          } else if (batch.status === 'partially_completed') {
            toast.warning(`Batch partially completed. ${batch.completed_items} succeeded, ${batch.failed_items} failed.`);
          }
        }
      } catch (error) {
        console.error('Error polling batch status:', error);
        clearInterval(interval);
      }
    }, 3000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'cancelled':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Batch Content Generator
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Generate 10-50 pieces of content at once with multiple AI models
        </p>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Batch</TabsTrigger>
          <TabsTrigger value="history">Batch History</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          {/* Batch Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Batch Configuration
              </CardTitle>
              <CardDescription>
                Set up your batch content generation job
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Batch Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Batch Name (Optional)</label>
                <Input
                  placeholder="e.g., Winter Fashion Campaign"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                />
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">Content Category</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      className="h-16 flex-col gap-1"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-xs">{category.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">Target Platform</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

              {/* AI Provider Selection */}
              <AIProviderSelector
                selectedProviders={selectedProviders}
                onProvidersChange={setSelectedProviders}
                disabled={isGenerating}
              />
            </CardContent>
          </Card>

          {/* Content Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Content Descriptions ({contentItems.length}/50)
                </div>
                <Button
                  onClick={addContentItem}
                  size="sm"
                  disabled={contentItems.length >= 50}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </CardTitle>
              <CardDescription>
                Add multiple content descriptions to generate in bulk
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contentItems.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm font-medium text-purple-600">
                    {index + 1}
                  </div>
                  <Textarea
                    placeholder={`Content description #${index + 1} - e.g., "Cozy winter outfit with oversized sweater and boots"`}
                    value={item}
                    onChange={(e) => updateContentItem(index, e.target.value)}
                    className="flex-1 min-h-[60px]"
                  />
                  {contentItems.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeContentItem(index)}
                      className="flex-shrink-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Card>
            <CardContent className="pt-6">
              <Button
                onClick={handleBatchGenerate}
                disabled={isGenerating || !selectedCategory || !selectedPlatform || selectedProviders.length === 0}
                className="w-full h-12 text-lg"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Starting Batch Generation...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    Generate {contentItems.filter(item => item.trim()).length} Content Items
                  </>
                )}
              </Button>
              
              {activeBatch && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(activeBatch.status)}
                      <span className="font-medium">{activeBatch.batch_name}</span>
                      <Badge className={getStatusColor(activeBatch.status)}>
                        {activeBatch.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{activeBatch.completed_items}/{activeBatch.total_items}</span>
                    </div>
                    <Progress 
                      value={(activeBatch.completed_items / activeBatch.total_items) * 100}
                      className="h-2"
                    />
                    {activeBatch.estimated_completion && activeBatch.status === 'processing' && (
                      <p className="text-xs text-gray-600">
                        Estimated completion: {new Date(activeBatch.estimated_completion).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Batch History
              </CardTitle>
              <CardDescription>
                View your previous batch generation jobs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {batches.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Play className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No batch generations yet</p>
                  <p className="text-sm">Create your first batch to see it here!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {batches.map((batch) => (
                    <div key={batch.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(batch.status)}
                          <div>
                            <h3 className="font-medium">{batch.batch_name}</h3>
                            <p className="text-sm text-gray-600">
                              {batch.category} • {batch.platform} • {new Date(batch.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(batch.status)}>
                          {batch.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Total Items</p>
                          <p className="font-medium">{batch.total_items}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Completed</p>
                          <p className="font-medium text-green-600">{batch.completed_items}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Failed</p>
                          <p className="font-medium text-red-600">{batch.failed_items}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BatchContentGenerator;