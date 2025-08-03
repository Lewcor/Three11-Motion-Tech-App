import React, { useState } from 'react';

const CaptionGenerator = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [selectedCategory, setSelectedCategory] = useState('fashion');
  const [prompt, setPrompt] = useState('');
  const [generatedCaptions, setGeneratedCaptions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const platforms = [
    { id: 'tiktok', name: 'TikTok', icon: '📱', color: 'bg-pink-100 text-pink-800' },
    { id: 'instagram', name: 'Instagram', icon: '📸', color: 'bg-purple-100 text-purple-800' },
    { id: 'youtube', name: 'YouTube', icon: '📺', color: 'bg-red-100 text-red-800' },
    { id: 'facebook', name: 'Facebook', icon: '👥', color: 'bg-blue-100 text-blue-800' },
  ];

  const categories = [
    { id: 'fashion', name: 'Fashion', icon: '👗' },
    { id: 'fitness', name: 'Fitness', icon: '💪' },
    { id: 'food', name: 'Food', icon: '🍕' },
    { id: 'travel', name: 'Travel', icon: '✈️' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'gaming', name: 'Gaming', icon: '🎮' },
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'ideas', name: 'Ideas', icon: '💡' },
    { id: 'events', name: 'Event Space', icon: '🏛️' }
  ];

  const sampleCaptions = [
    {
      text: "✨ Transform your style game with this simple trick! Who else is obsessed with minimalist fashion? Drop a 💕 if you're loving this vibe! #MinimalStyle #FashionInspo #OOTD",
      hashtags: "#MinimalStyle #FashionInspo #OOTD #StyleTips #Fashion2025"
    },
    {
      text: "POV: You found the perfect outfit formula 👗 Save this for later and thank me later! What's your go-to style secret? Share below! ⬇️ #FashionHacks #StyleSecrets",
      hashtags: "#FashionHacks #StyleSecrets #OOTD #FashionTips #Styling"
    },
    {
      text: "This color combination is everything! 🌈 Swipe to see how I styled it 3 different ways. Which look is your favorite? 1, 2, or 3? #ColorCombo #Fashion #Styling",
      hashtags: "#ColorCombo #Fashion #Styling #OOTD #FashionInspo"
    }
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setGeneratedCaptions(sampleCaptions);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">✨ Caption Generator</h1>
          <p className="text-xl text-gray-600">Generate viral captions for all your social media platforms</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              {/* Platform Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Platform</label>
                <div className="grid grid-cols-2 gap-2">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                        selectedPlatform === platform.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{platform.icon}</div>
                      <div className="text-sm font-medium">{platform.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Content Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Prompt Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Describe Your Content</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Trying on a cute summer dress, sharing my morning routine..."
                  rows={4}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  isGenerating || !prompt.trim()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                }`}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Generating...</span>
                  </div>
                ) : (
                  'Generate Captions'
                )}
              </button>

              {/* AI Groups Info */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-2">🤖 Powered by Triple AI</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>• Group 1: Creative & Engaging</div>
                  <div>• Group 2: Thoughtful & Nuanced</div>
                  <div>• Group 3: Trendy & Current</div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {generatedCaptions.length > 0 ? (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Generated Captions</h3>
                {generatedCaptions.map((caption, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-semibold text-gray-800">Caption {index + 1}</h4>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-500 hover:text-blue-500 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-800 leading-relaxed">{caption.text}</p>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <strong>Hashtags:</strong> {caption.hashtags}
                        </div>
                        <div className="text-xs text-gray-400">
                          Optimized for {platforms.find(p => p.id === selectedPlatform)?.name}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-6">✨</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Generate Viral Captions?</h3>
                <p className="text-gray-600 mb-8">
                  Select your platform, choose a category, describe your content, and let our AI create engaging captions for you.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                  <div className="flex items-center justify-center space-x-1">
                    <span>📱</span>
                    <span>Platform-specific</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <span>🎯</span>
                    <span>Category-optimized</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <span>🔥</span>
                    <span>Viral potential</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <span>⚡</span>
                    <span>Instant results</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptionGenerator;