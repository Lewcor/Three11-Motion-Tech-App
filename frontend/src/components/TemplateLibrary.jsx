import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BookOpen, Star, Crown, Copy, Eye, Sparkles, Filter, Search, Plus, Zap } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const TemplateLibrary = () => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [placeholderValues, setPlaceholderValues] = useState({});
  const [generatedContent, setGeneratedContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
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

  const templateTypes = [
    { id: 'caption', name: 'Captions', icon: '📝' },
    { id: 'hooks', name: 'Hooks', icon: '🎣' },
    { id: 'cta', name: 'Call to Action', icon: '📢' },
    { id: 'story_arc', name: 'Story Arc', icon: '📖' }
  ];

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchQuery, categoryFilter, platformFilter, typeFilter, showPremiumOnly]);

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (categoryFilter) params.append('category', categoryFilter);
      if (platformFilter) params.append('platform', platformFilter);
      if (typeFilter) params.append('template_type', typeFilter);
      params.append('include_premium', 'true');

      const response = await axios.get(`${API}/templates?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    if (searchQuery) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (showPremiumOnly) {
      filtered = filtered.filter(template => template.is_premium);
    }

    // Sort by usage count (most popular first)
    filtered.sort((a, b) => b.usage_count - a.usage_count);

    setFilteredTemplates(filtered);
  };

  const handleUseTemplate = async (template) => {
    setSelectedTemplate(template);
    
    // Initialize placeholder values
    const initialValues = {};
    template.placeholders.forEach(placeholder => {
      initialValues[placeholder] = '';
    });
    setPlaceholderValues(initialValues);
  };

  const handleGenerateFromTemplate = async () => {
    if (!selectedTemplate) return;

    // Check if all placeholders are filled
    const missingPlaceholders = selectedTemplate.placeholders.filter(
      placeholder => !placeholderValues[placeholder]?.trim()
    );

    if (missingPlaceholders.length > 0) {
      toast.error(`Please fill in: ${missingPlaceholders.join(', ')}`);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API}/templates/use/${selectedTemplate.id}`, 
        placeholderValues,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setGeneratedContent(response.data.content);
      toast.success('Content generated from template!');
    } catch (error) {
      console.error('Error using template:', error);
      toast.error(error.response?.data?.detail || 'Failed to use template');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find(c => c.id === categoryId) || { icon: '📝', name: categoryId };
  };

  const getPlatformInfo = (platformId) => {
    return platforms.find(p => p.id === platformId) || { icon: '📱', name: platformId };
  };

  const getTypeInfo = (typeId) => {
    return templateTypes.find(t => t.id === typeId) || { icon: '📝', name: typeId };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
          Template Library
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Professional content templates for every occasion
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium mb-2">Search Templates</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Platform Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Platform</label>
                <select
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">All Platforms</option>
                  {platforms.map(platform => (
                    <option key={platform.id} value={platform.id}>
                      {platform.icon} {platform.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Template Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">All Types</option>
                  {templateTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Premium Filter */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="premium"
                  checked={showPremiumOnly}
                  onChange={(e) => setShowPremiumOnly(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="premium" className="text-sm font-medium flex items-center gap-1">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  Premium Only
                </label>
              </div>

              <Button onClick={fetchTemplates} variant="outline" className="w-full">
                Reset Filters
              </Button>
            </CardContent>
          </Card>

          {/* Template Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Library Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total Templates</span>
                  <Badge variant="outline">{templates.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Filtered Results</span>
                  <Badge variant="outline">{filteredTemplates.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Premium Templates</span>
                  <Badge className="bg-yellow-100 text-yellow-700">
                    {templates.filter(t => t.is_premium).length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Templates Grid */}
        <div className="lg:col-span-3">
          {selectedTemplate ? (
            /* Template Editor */
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getTypeInfo(selectedTemplate.template_type).icon}
                      {selectedTemplate.name}
                      {selectedTemplate.is_premium && (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      )}
                    </CardTitle>
                    <CardDescription>{selectedTemplate.description}</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedTemplate(null);
                      setGeneratedContent('');
                      setPlaceholderValues({});
                    }}
                  >
                    Back to Library
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Template Info */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    {getCategoryInfo(selectedTemplate.category).icon}
                    <span>{getCategoryInfo(selectedTemplate.category).name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getPlatformInfo(selectedTemplate.platform).icon}
                    <span>{getPlatformInfo(selectedTemplate.platform).name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    Used {selectedTemplate.usage_count} times
                  </div>
                </div>

                {/* Template Tags */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>

                {/* Placeholders */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium">Fill in the placeholders:</label>
                  {selectedTemplate.placeholders.map((placeholder) => (
                    <div key={placeholder}>
                      <label className="block text-sm font-medium mb-1 capitalize">
                        {placeholder.replace(/_/g, ' ')}
                      </label>
                      <Input
                        placeholder={`Enter ${placeholder.replace(/_/g, ' ')}`}
                        value={placeholderValues[placeholder] || ''}
                        onChange={(e) => setPlaceholderValues({
                          ...placeholderValues,
                          [placeholder]: e.target.value
                        })}
                      />
                    </div>
                  ))}
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerateFromTemplate}
                  disabled={loading || selectedTemplate.placeholders.some(p => !placeholderValues[p]?.trim())}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Generate Content
                    </>
                  )}
                </Button>

                {/* Generated Content */}
                {generatedContent && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium">Generated Content:</label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generatedContent)}
                      >
                        <Copy className="mr-1 h-4 w-4" />
                        Copy
                      </Button>
                    </div>
                    <Textarea
                      value={generatedContent}
                      onChange={(e) => setGeneratedContent(e.target.value)}
                      rows={8}
                      className="font-mono"
                    />
                  </div>
                )}

                {/* Example Output */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Example Output:</label>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm whitespace-pre-wrap">
                    {selectedTemplate.example_output}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Templates List */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {filteredTemplates.length} Templates Found
                </h2>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Custom
                </Button>
              </div>

              {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredTemplates.map((template) => (
                    <Card key={template.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            {getTypeInfo(template.template_type).icon}
                            {template.name}
                            {template.is_premium && (
                              <Crown className="h-4 w-4 text-yellow-500" />
                            )}
                          </CardTitle>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Star className="h-4 w-4" />
                            {template.usage_count}
                          </div>
                        </div>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Template Info */}
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            {getCategoryInfo(template.category).icon}
                            <span>{getCategoryInfo(template.category).name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getPlatformInfo(template.platform).icon}
                            <span>{getPlatformInfo(template.platform).name}</span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {template.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {template.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.tags.length - 3}
                            </Badge>
                          )}
                        </div>

                        {/* Placeholders */}
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Placeholders:</span> {template.placeholders.length > 0 ? template.placeholders.join(', ') : 'None'}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleUseTemplate(template)}
                            className="flex-1"
                          >
                            <Zap className="mr-2 h-4 w-4" />
                            Use Template
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No templates found matching your criteria</p>
                  <p className="text-sm">Try adjusting your filters or search terms</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateLibrary;