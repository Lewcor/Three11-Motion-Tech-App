import React, { useState } from 'react';

const ContentRemix = () => {
  const [inputContent, setInputContent] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('viral');
  const [selectedPlatform, setSelectedPlatform] = useState('tiktok');
  const [remixedContent, setRemixedContent] = useState(null);
  const [isRemixing, setIsRemixing] = useState(false);

  const remixStyles = [
    { id: 'viral', name: 'Viral Hook', icon: '🔥', description: 'Create attention-grabbing viral content' },
    { id: 'educational', name: 'Educational', icon: '🎓', description: 'Transform into informative content' },
    { id: 'entertaining', name: 'Entertaining', icon: '🎭', description: 'Add humor and entertainment value' },
    { id: 'inspirational', name: 'Inspirational', icon: '✨', description: 'Make it motivational and uplifting' },
  ];

  const platforms = [
    { id: 'tiktok', name: 'TikTok', icon: '📱' },
    { id: 'instagram', name: 'Instagram', icon: '📸' },
    { id: 'youtube', name: 'YouTube', icon: '📺' },
    { id: 'facebook', name: 'Facebook', icon: '👥' },
  ];

  const handleRemix = () => {
    setIsRemixing(true);
    // Simulate AI remix process
    setTimeout(() => {
      setRemixedContent({
        original: inputContent,
        remixed: "🔥 Did you know that the secret to viral content is... [HOOK] This simple trick that creators don't want you to know will change your engagement forever! Here's what happened when I tried it... [YOUR CONTENT TRANSFORMED] Drop a 💡 if this blew your mind! #ViralTips #ContentHack #CreatorSecrets",
        improvements: [
          "Added viral hook at the beginning",
          "Included emotional triggers",
          "Optimized for selected platform",
          "Enhanced with trending elements"
        ]
      });
      setIsRemixing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with AI badge */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <h1 className="text-4xl font-bold text-gray-900">🔄 Content Remix</h1>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 font-bold text-sm rounded-full">AI</span>
          </div>
          <p className="text-xl text-gray-600">Transform your existing content into viral masterpieces</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Input Content</h3>
              
              {/* Original Content Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Original Content</label>
                <textarea
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  placeholder="Paste your existing content here... (caption, script, post, etc.)"
                  rows={8}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                <div className="mt-2 text-sm text-gray-500">
                  {inputContent.length}/1000 characters
                </div>
              </div>

              {/* Remix Style Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-4">Remix Style</label>
                <div className="grid grid-cols-2 gap-3">
                  {remixStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        selectedStyle === style.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="text-2xl mb-2">{style.icon}</div>
                      <h4 className="font-semibold text-gray-900 mb-1">{style.name}</h4>
                      <p className="text-xs text-gray-600">{style.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Target Platform</label>
                <div className="grid grid-cols-4 gap-2">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                        selectedPlatform === platform.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-xl mb-1">{platform.icon}</div>
                      <div className="text-xs font-medium">{platform.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Remix Button */}
              <button
                onClick={handleRemix}
                disabled={isRemixing || !inputContent.trim()}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  isRemixing || !inputContent.trim()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105'
                }`}
              >
                {isRemixing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>AI is remixing your content...</span>
                  </div>
                ) : (
                  'Remix Content with AI'
                )}
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            {remixedContent ? (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">AI-Remixed Content</h3>
                
                {/* Before/After Comparison */}
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-700 mb-2">Original:</h4>
                    <p className="text-gray-800 text-sm leading-relaxed">{remixedContent.original}</p>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <h4 className="font-semibold text-purple-700 mb-2">AI Remixed:</h4>
                    <p className="text-gray-800 leading-relaxed">{remixedContent.remixed}</p>
                  </div>
                </div>

                {/* Improvements Made */}
                <div className="mt-6 p-4 bg-green-50 rounded-xl">
                  <h4 className="font-semibold text-green-800 mb-3">✨ AI Improvements Made:</h4>
                  <ul className="space-y-2">
                    {remixedContent.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-green-700">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex space-x-3">
                  <button className="flex-1 py-3 px-4 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors font-medium">
                    Copy Remixed Content
                  </button>
                  <button className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium">
                    Remix Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="text-center py-12">
                  <div className="text-6xl mb-6">🔄</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Transform Your Content?</h3>
                  <p className="text-gray-600 mb-8">
                    Paste your existing content, choose a remix style, and let AI transform it into something viral.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                    <div className="flex items-center justify-center space-x-1">
                      <span>🎯</span>
                      <span>Viral optimization</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <span>📱</span>
                      <span>Platform-specific</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <span>🤖</span>
                      <span>AI-powered</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <span>⚡</span>
                      <span>Instant results</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tips Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-bold text-gray-900 mb-4">💡 Remix Pro Tips</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Works best with content between 50-500 characters</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Try different remix styles for various outcomes</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Platform selection affects hashtags and tone</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Combine with Caption Generator for best results</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentRemix;