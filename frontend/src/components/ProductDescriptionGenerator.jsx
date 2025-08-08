import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ShoppingBag, Tag, Target, Copy, Star, TrendingUp, Plus, Minus, Zap, BarChart3, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import AIProviderSelector from './AIProviderSelector';
import axios from 'axios';

const ProductDescriptionGenerator = () => {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [keyFeatures, setKeyFeatures] = useState(['']);
  const [benefits, setBenefits] = useState(['']);
  const [targetAudience, setTargetAudience] = useState('');
  const [brandStyle, setBrandStyle] = useState('modern');
  const [descriptionLength, setDescriptionLength] = useState('medium');
  const [includeBulletPoints, setIncludeBulletPoints] = useState(true);
  const [includeSpecifications, setIncludeSpecifications] = useState(true);
  const [includeUsageInstructions, setIncludeUsageInstructions] = useState(false);
  const [persuasionStyle, setPersuasionStyle] = useState('benefits_focused');
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [productHistory, setProductHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API = `${BACKEND_URL}/api`;

  const brandStyles = [
    { id: 'modern', name: 'Modern', description: 'Clean, innovative, forward-thinking', icon: '🚀' },
    { id: 'classic', name: 'Classic', description: 'Timeless, traditional, reliable', icon: '🏛️' },
    { id: 'playful', name: 'Playful', description: 'Fun, energetic, casual', icon: '🎨' },
    { id: 'luxury', name: 'Luxury', description: 'Premium, exclusive, sophisticated', icon: '💎' },
    { id: 'minimalist', name: 'Minimalist', description: 'Simple, essential, clean', icon: '⚪' }
  ];

  const descriptionLengths = [
    { id: 'short', name: 'Short', description: '50-100 words, concise and punchy' },
    { id: 'medium', name: 'Medium', description: '100-250 words, balanced detail' },
    { id: 'long', name: 'Long', description: '250-500 words, comprehensive' }
  ];

  const persuasionStyles = [
    { id: 'benefits_focused', name: 'Benefits Focused', description: 'Emphasize what customer gains' },
    { id: 'feature_focused', name: 'Feature Focused', description: 'Highlight specifications and capabilities' },
    { id: 'story_driven', name: 'Story Driven', description: 'Use narrative and emotional connection' }
  ];

  const categories = [
    'Electronics', 'Fashion', 'Home & Garden', 'Beauty', 'Sports', 'Automotive', 
    'Books', 'Toys', 'Food & Beverage', 'Health', 'Software', 'Services'
  ];

  useEffect(() => {
    fetchProductHistory();
    fetchAnalytics();
  }, []);

  const fetchProductHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/product/descriptions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductHistory(response.data);
    } catch (error) {
      console.error('Error fetching product history:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/product/analytics`, {
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
    const validFeatures = keyFeatures.filter(f => f.trim());
    const validBenefits = benefits.filter(b => b.trim());
    
    if (!productName.trim() || !category.trim() || !targetAudience.trim() || validFeatures.length === 0 || validBenefits.length === 0 || selectedProviders.length === 0) {
      toast.error('Please fill all required fields and select AI providers');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API}/product/description`, {
        product_name: productName,
        category: category,
        price: price ? parseFloat(price) : null,
        key_features: validFeatures,
        benefits: validBenefits,
        target_audience: targetAudience,
        brand_style: brandStyle,
        description_length: descriptionLength,
        include_bullet_points: includeBulletPoints,
        include_specifications: includeSpecifications,
        include_usage_instructions: includeUsageInstructions,
        persuasion_style: persuasionStyle,
        ai_providers: selectedProviders
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setResults(response.data);
      toast.success('Product description generated successfully!');
      fetchProductHistory();
      fetchAnalytics();
    } catch (error) {
      console.error('Error generating product description:', error);
      toast.error(error.response?.data?.detail || 'Failed to generate product description');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
          Product Description Generator
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Create compelling product descriptions that convert browsers into buyers
        </p>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Description</TabsTrigger>
          <TabsTrigger value="history">Product History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Product Information
                  </CardTitle>
                  <CardDescription>
                    Basic details about your product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Name *</label>
                    <Input
                      placeholder="e.g., Wireless Bluetooth Headphones Pro"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Price (Optional)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="number"
                          placeholder="99.99"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Target Audience *</label>
                    <Input
                      placeholder="e.g., Music lovers, fitness enthusiasts, remote workers"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Key Features ({keyFeatures.filter(f => f.trim()).length})
                    </div>
                    <Button
                      onClick={() => addItem(keyFeatures, setKeyFeatures)}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    What makes your product special?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {keyFeatures.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm font-medium text-orange-600">
                        {index + 1}
                      </div>
                      <Input
                        placeholder={`Feature #${index + 1} - e.g., 30-hour battery life`}
                        value={feature}
                        onChange={(e) => updateItem(keyFeatures, setKeyFeatures, index, e.target.value)}
                        className="flex-1"
                      />
                      {keyFeatures.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(keyFeatures, setKeyFeatures, index)}
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
                      <Star className="h-5 w-5" />
                      Key Benefits ({benefits.filter(b => b.trim()).length})
                    </div>
                    <Button
                      onClick={() => addItem(benefits, setBenefits)}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    How does your product improve customers' lives?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-2">
                      <Textarea
                        placeholder={`Benefit #${index + 1} - e.g., Enjoy uninterrupted music for your entire workday`}
                        value={benefit}
                        onChange={(e) => updateItem(benefits, setBenefits, index, e.target.value)}
                        rows={2}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(benefits, setBenefits, index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Brand & Style Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-3">Brand Style</label>
                    <div className="grid grid-cols-1 gap-3">
                      {brandStyles.map((style) => (
                        <Button
                          key={style.id}
                          variant={brandStyle === style.id ? 'default' : 'outline'}
                          className="h-16 justify-start text-left"
                          onClick={() => setBrandStyle(style.id)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{style.icon}</span>
                            <div>
                              <div className="font-medium">{style.name}</div>
                              <div className="text-xs opacity-70">{style.description}</div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-3">Description Length</label>
                      <select
                        value={descriptionLength}
                        onChange={(e) => setDescriptionLength(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      >
                        {descriptionLengths.map(length => (
                          <option key={length.id} value={length.id}>
                            {length.name} - {length.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-3">Persuasion Style</label>
                      <select
                        value={persuasionStyle}
                        onChange={(e) => setPersuasionStyle(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      >
                        {persuasionStyles.map(style => (
                          <option key={style.id} value={style.id}>
                            {style.name}
                          </option>
                        ))}
                      </select>
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
                      id="bullets"
                      checked={includeBulletPoints}
                      onChange={(e) => setIncludeBulletPoints(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="bullets" className="text-sm font-medium">
                      Include bullet points
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="specs"
                      checked={includeSpecifications}
                      onChange={(e) => setIncludeSpecifications(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="specs" className="text-sm font-medium">
                      Include specifications
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="usage"
                      checked={includeUsageInstructions}
                      onChange={(e) => setIncludeUsageInstructions(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="usage" className="text-sm font-medium">
                      Include usage instructions
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
                disabled={loading || !productName.trim() || !category.trim() || !targetAudience.trim() || keyFeatures.filter(f => f.trim()).length === 0 || benefits.filter(b => b.trim()).length === 0 || selectedProviders.length === 0}
                className="w-full h-12 text-lg"
                size="lg"
              >
                {loading ? (
                  <>
                    <Zap className="mr-2 h-5 w-5 animate-spin" />
                    Generating Description...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Generate Product Description
                  </>
                )}
              </Button>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {results ? (
                <div className="space-y-6">
                  {/* Product Title */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        Product Title
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium flex-1">{results.title}</span>
                        <Button
                          onClick={() => copyToClipboard(results.title)}
                          variant="ghost"
                          size="sm"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Short Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Short Description
                        </div>
                        <Button
                          onClick={() => copyToClipboard(results.short_description)}
                          variant="outline"
                          size="sm"
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        Perfect for product listings and search results
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm">{results.short_description}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Long Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-5 w-5" />
                          Full Description
                        </div>
                        <Button
                          onClick={() => copyToClipboard(results.long_description)}
                          variant="outline"
                          size="sm"
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        Comprehensive description for product pages
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 bg-white border rounded-lg max-h-64 overflow-y-auto">
                        <pre className="text-sm whitespace-pre-wrap font-sans">{results.long_description}</pre>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Bullet Points */}
                  {results.bullet_points && results.bullet_points.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Star className="h-5 w-5" />
                          Key Features ({results.bullet_points.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {results.bullet_points.map((point, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm flex-1">{point}</span>
                            </div>
                          ))}
                        </div>
                        <Button
                          onClick={() => copyToClipboard(results.bullet_points.map(p => `• ${p}`).join('\n'))}
                          variant="outline"
                          size="sm"
                          className="mt-4"
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy All Points
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Specifications */}
                  {results.specifications && Object.keys(results.specifications).length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          Specifications ({Object.keys(results.specifications).length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Object.entries(results.specifications).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-2 border rounded">
                              <span className="font-medium text-sm">{key}</span>
                              <span className="text-sm text-gray-600">{value}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Usage Instructions */}
                  {results.usage_instructions && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Usage Instructions</span>
                          <Button
                            onClick={() => copyToClipboard(results.usage_instructions)}
                            variant="outline"
                            size="sm"
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <pre className="text-sm whitespace-pre-wrap font-sans">{results.usage_instructions}</pre>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Marketing Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {results.seo_keywords && results.seo_keywords.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            SEO Keywords ({results.seo_keywords.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {results.seo_keywords.map((keyword, index) => (
                              <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => copyToClipboard(keyword)}>
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {results.marketing_angles && results.marketing_angles.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Marketing Angles ({results.marketing_angles.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {results.marketing_angles.map((angle, index) => (
                              <li key={index}>{angle}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Cross-sell Suggestions */}
                  {results.cross_sell_suggestions && results.cross_sell_suggestions.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ShoppingBag className="h-5 w-5" />
                          Cross-sell Suggestions ({results.cross_sell_suggestions.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {results.cross_sell_suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                    <ShoppingBag className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>Your generated product description will appear here</p>
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
                <ShoppingBag className="h-5 w-5" />
                Product Description History
              </CardTitle>
              <CardDescription>
                Your previously generated product descriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {productHistory.length > 0 ? (
                <div className="space-y-4">
                  {productHistory.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{product.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {product.bullet_points?.length || 0} features
                          </Badge>
                          <Badge className="text-xs bg-orange-100 text-orange-700">
                            {product.brand_style}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 truncate">
                        {product.short_description}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        Created: {new Date(product.created_at).toLocaleDateString()}
                      </p>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyToClipboard(product.long_description)}
                          variant="outline"
                          size="sm"
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Full Description
                        </Button>
                        <Button
                          onClick={() => copyToClipboard(product.short_description)}
                          variant="outline"
                          size="sm"
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Short
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingBag className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No product descriptions generated yet</p>
                  <p className="text-sm">Create your first product description to see it here!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {analytics?.total_products || 0}
                </div>
                <div className="text-sm text-gray-600">Total Products</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Object.keys(analytics?.categories || {}).length}
                </div>
                <div className="text-sm text-gray-600">Categories</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Object.keys(analytics?.brand_styles || {}).length}
                </div>
                <div className="text-sm text-gray-600">Brand Styles</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analytics?.categories && Object.keys(analytics.categories).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    By Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analytics.categories).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span>{category}</span>
                        <Badge variant="outline">{count} products</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {analytics?.brand_styles && Object.keys(analytics.brand_styles).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    By Brand Style
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analytics.brand_styles).map(([style, count]) => (
                      <div key={style} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{brandStyles.find(s => s.id === style)?.icon || '📦'}</span>
                          <span className="capitalize">{style}</span>
                        </div>
                        <Badge variant="outline">{count} products</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDescriptionGenerator;