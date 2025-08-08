import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FileText, Search, Target, Copy, Eye, TrendingUp, Share2, Plus, Minus, Zap, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import AIProviderSelector from './AIProviderSelector';
import axios from 'axios';

const BlogPostGenerator = () => {
  const [topic, setTopic] = useState('');
  const [targetKeywords, setTargetKeywords] = useState(['']);
  const [wordCountTarget, setWordCountTarget] = useState(1500);
  const [audience, setAudience] = useState('');
  const [purpose, setPurpose] = useState('inform');
  const [tone, setTone] = useState('professional');
  const [includeOutline, setIncludeOutline] = useState(true);
  const [includeMetaDescription, setIncludeMetaDescription] = useState(true);
  const [includeSocialSnippets, setIncludeSocialSnippets] = useState(true);
  const [seoFocus, setSeoFocus] = useState(true);
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [blogHistory, setBlogHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API = `${BACKEND_URL}/api`;

  const purposes = [
    { id: 'inform', name: 'Inform', description: 'Educational and informative content', icon: '📚' },
    { id: 'persuade', name: 'Persuade', description: 'Convince readers to take action', icon: '🎯' },
    { id: 'entertain', name: 'Entertain', description: 'Engaging and fun content', icon: '🎭' },
    { id: 'educate', name: 'Educate', description: 'Teaching and instructional content', icon: '🎓' }
  ];

  const tones = [
    { id: 'professional', name: 'Professional', description: 'Formal and authoritative' },
    { id: 'casual', name: 'Casual', description: 'Relaxed and conversational' },
    { id: 'authoritative', name: 'Authoritative', description: 'Expert and commanding' },
    { id: 'conversational', name: 'Conversational', description: 'Friendly and approachable' }
  ];

  const wordCountOptions = [
    { value: 800, label: '800 words - Short form' },
    { value: 1500, label: '1,500 words - Standard' },
    { value: 2500, label: '2,500 words - Long form' },
    { value: 4000, label: '4,000+ words - Comprehensive' }
  ];

  useEffect(() => {
    fetchBlogHistory();
    fetchAnalytics();
  }, []);

  const fetchBlogHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/blog/posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBlogHistory(response.data);
    } catch (error) {
      console.error('Error fetching blog history:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/blog/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const addKeyword = () => {
    setTargetKeywords([...targetKeywords, '']);
  };

  const removeKeyword = (index) => {
    if (targetKeywords.length > 1) {
      setTargetKeywords(targetKeywords.filter((_, i) => i !== index));
    }
  };

  const updateKeyword = (index, value) => {
    const updated = [...targetKeywords];
    updated[index] = value;
    setTargetKeywords(updated);
  };

  const handleGenerate = async () => {
    const validKeywords = targetKeywords.filter(k => k.trim());
    
    if (!topic.trim() || validKeywords.length === 0 || !audience.trim() || selectedProviders.length === 0) {
      toast.error('Please fill required fields and select AI providers');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API}/blog/post`, {
        topic: topic,
        target_keywords: validKeywords,
        word_count_target: wordCountTarget,
        audience: audience,
        purpose: purpose,
        tone: tone,
        include_outline: includeOutline,
        include_meta_description: includeMetaDescription,
        include_social_snippets: includeSocialSnippets,
        seo_focus: seoFocus,
        ai_providers: selectedProviders
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setResults(response.data);
      toast.success('Blog post generated successfully!');
      fetchBlogHistory();
      fetchAnalytics();
    } catch (error) {
      console.error('Error generating blog post:', error);
      toast.error(error.response?.data?.detail || 'Failed to generate blog post');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Blog Post Generator
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Create SEO-optimized blog posts that rank and engage readers
        </p>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Blog Post</TabsTrigger>
          <TabsTrigger value="history">Blog History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Blog Post Details
                  </CardTitle>
                  <CardDescription>
                    Basic information about your blog post
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Topic / Title *</label>
                    <Input
                      placeholder="e.g., The Ultimate Guide to Social Media Marketing in 2024"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Target Audience *</label>
                    <Input
                      placeholder="e.g., Small business owners, marketing professionals, entrepreneurs"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Word Count Target</label>
                    <select
                      value={wordCountTarget}
                      onChange={(e) => setWordCountTarget(parseInt(e.target.value))}
                      className="w-full p-2 border rounded-lg"
                    >
                      {wordCountOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      SEO Keywords ({targetKeywords.filter(k => k.trim()).length})
                    </div>
                    <Button
                      onClick={addKeyword}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Add target keywords for SEO optimization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {targetKeywords.map((keyword, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-medium text-green-600">
                        {index + 1}
                      </div>
                      <Input
                        placeholder={`Keyword #${index + 1} - e.g., social media marketing`}
                        value={keyword}
                        onChange={(e) => updateKeyword(index, e.target.value)}
                        className="flex-1"
                      />
                      {targetKeywords.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeKeyword(index)}
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
                  <CardTitle>Content Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-3">Purpose</label>
                    <div className="grid grid-cols-2 gap-3">
                      {purposes.map((purposeOption) => (
                        <Button
                          key={purposeOption.id}
                          variant={purpose === purposeOption.id ? 'default' : 'outline'}
                          className="h-16 flex-col gap-1"
                          onClick={() => setPurpose(purposeOption.id)}
                        >
                          <span className="text-lg">{purposeOption.icon}</span>
                          <span className="font-medium text-sm">{purposeOption.name}</span>
                          <span className="text-xs opacity-70">{purposeOption.description}</span>
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
                          <span className="font-medium text-sm">{toneOption.name}</span>
                          <span className="text-xs opacity-70">{toneOption.description}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="outline"
                      checked={includeOutline}
                      onChange={(e) => setIncludeOutline(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="outline" className="text-sm font-medium">
                      Include blog outline
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="meta"
                      checked={includeMetaDescription}
                      onChange={(e) => setIncludeMetaDescription(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="meta" className="text-sm font-medium">
                      Include meta description
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="social"
                      checked={includeSocialSnippets}
                      onChange={(e) => setIncludeSocialSnippets(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="social" className="text-sm font-medium flex items-center gap-1">
                      <Share2 className="h-4 w-4" />
                      Include social media snippets
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="seo"
                      checked={seoFocus}
                      onChange={(e) => setSeoFocus(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="seo" className="text-sm font-medium flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      SEO focus & optimization
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
                disabled={loading || !topic.trim() || targetKeywords.filter(k => k.trim()).length === 0 || !audience.trim() || selectedProviders.length === 0}
                className="w-full h-12 text-lg"
                size="lg"
              >
                {loading ? (
                  <>
                    <Zap className="mr-2 h-5 w-5 animate-spin" />
                    Generating Blog Post...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-5 w-5" />
                    Generate Blog Post
                  </>
                )}
              </Button>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {results ? (
                <div className="space-y-6">
                  {/* Title & Meta */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Title & Meta Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium">Blog Title</label>
                          <Button
                            onClick={() => copyToClipboard(results.title)}
                            variant="ghost"
                            size="sm"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium">{results.title}</p>
                        </div>
                      </div>

                      {results.meta_description && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium">Meta Description</label>
                            <Button
                              onClick={() => copyToClipboard(results.meta_description)}
                              variant="ghost"
                              size="sm"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm">{results.meta_description}</p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">{results.word_count}</div>
                          <div className="text-xs text-blue-600">Words</div>
                        </div>
                        <div className={`p-3 rounded-lg ${getScoreBg(results.readability_score)}`}>
                          <div className={`text-lg font-bold ${getScoreColor(results.readability_score)}`}>
                            {results.readability_score}
                          </div>
                          <div className={`text-xs ${getScoreColor(results.readability_score)}`}>Readability</div>
                        </div>
                        <div className={`p-3 rounded-lg ${getScoreBg(results.seo_score)}`}>
                          <div className={`text-lg font-bold ${getScoreColor(results.seo_score)}`}>
                            {results.seo_score}
                          </div>
                          <div className={`text-xs ${getScoreColor(results.seo_score)}`}>SEO Score</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Outline */}
                  {results.outline && results.outline.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          Blog Outline ({results.outline.length} sections)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {results.outline.map((section, index) => (
                            <div key={index} className="border rounded-lg p-3">
                              <h4 className="font-medium text-sm">{section.section}</h4>
                              {section.points && section.points.length > 0 && (
                                <ul className="list-disc list-inside mt-2 text-xs text-gray-600">
                                  {section.points.map((point, idx) => (
                                    <li key={idx}>{point}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Blog Content */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Blog Content
                        </div>
                        <Button
                          onClick={() => copyToClipboard(results.content)}
                          variant="outline"
                          size="sm"
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy All
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 bg-white border rounded-lg max-h-96 overflow-y-auto">
                        <pre className="text-sm whitespace-pre-wrap font-sans">{results.content}</pre>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Social Snippets */}
                  {results.social_snippets && Object.keys(results.social_snippets).length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Share2 className="h-5 w-5" />
                          Social Media Snippets
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Object.entries(results.social_snippets).map(([platform, snippet]) => (
                            <div key={platform} className="border rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <Badge className="capitalize">{platform}</Badge>
                                <Button
                                  onClick={() => copyToClipboard(snippet)}
                                  variant="ghost"
                                  size="sm"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-sm">{snippet}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* SEO Suggestions */}
                  {(results.suggested_images?.length > 0 || results.internal_link_suggestions?.length > 0) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          SEO Suggestions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {results.suggested_images?.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Suggested Images ({results.suggested_images.length})</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              {results.suggested_images.map((image, index) => (
                                <li key={index}>{image}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {results.internal_link_suggestions?.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Internal Link Opportunities ({results.internal_link_suggestions.length})</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              {results.internal_link_suggestions.map((link, index) => (
                                <li key={index}>{link}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                    <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>Your generated blog post will appear here</p>
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
                Blog Post History
              </CardTitle>
              <CardDescription>
                Your previously generated blog posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {blogHistory.length > 0 ? (
                <div className="space-y-4">
                  {blogHistory.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{post.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {post.word_count} words
                          </Badge>
                          <Badge className={`text-xs ${getScoreBg(post.seo_score)} ${getScoreColor(post.seo_score)}`}>
                            SEO: {post.seo_score}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Readability: {post.readability_score} • Created: {new Date(post.created_at).toLocaleDateString()}
                      </p>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyToClipboard(post.content)}
                          variant="outline"
                          size="sm"
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Content
                        </Button>
                        {post.meta_description && (
                          <Button
                            onClick={() => copyToClipboard(post.meta_description)}
                            variant="outline"
                            size="sm"
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Meta
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No blog posts generated yet</p>
                  <p className="text-sm">Create your first blog post to see it here!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {analytics?.total_posts || 0}
                </div>
                <div className="text-sm text-gray-600">Total Posts</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {analytics?.avg_word_count || 0}
                </div>
                <div className="text-sm text-gray-600">Avg Words</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className={`p-6 text-center ${getScoreBg(analytics?.avg_readability || 0)}`}>
                <div className={`text-2xl font-bold ${getScoreColor(analytics?.avg_readability || 0)}`}>
                  {analytics?.avg_readability || 0}
                </div>
                <div className={`text-sm ${getScoreColor(analytics?.avg_readability || 0)}`}>Avg Readability</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className={`p-6 text-center ${getScoreBg(analytics?.avg_seo_score || 0)}`}>
                <div className={`text-2xl font-bold ${getScoreColor(analytics?.avg_seo_score || 0)}`}>
                  {analytics?.avg_seo_score || 0}
                </div>
                <div className={`text-sm ${getScoreColor(analytics?.avg_seo_score || 0)}`}>Avg SEO Score</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Content Performance Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
                  <p className="text-sm"><strong>SEO Score 80+:</strong> Excellent keyword optimization and structure</p>
                </div>
                <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <p className="text-sm"><strong>Readability 60+:</strong> Good balance of sentence length and complexity</p>
                </div>
                <div className="p-3 bg-purple-50 border-l-4 border-purple-500 rounded">
                  <p className="text-sm"><strong>Word Count 1500+:</strong> Comprehensive content that performs well in search</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlogPostGenerator;