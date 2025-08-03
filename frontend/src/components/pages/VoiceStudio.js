import React, { useState } from 'react';

const VoiceStudio = () => {
  const [selectedVoice, setSelectedVoice] = useState('creative');
  const [script, setScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const voiceTypes = [
    { 
      id: 'creative', 
      name: 'Creative & Engaging',
      icon: '🎨',
      description: 'Perfect for entertainment and viral content',
      color: 'border-blue-500 bg-blue-50'
    },
    { 
      id: 'professional', 
      name: 'Professional & Clear',
      icon: '💼',
      description: 'Ideal for business and educational content',
      color: 'border-purple-500 bg-purple-50'
    },
    { 
      id: 'trendy', 
      name: 'Trendy & Current',
      icon: '🔥',
      description: 'Great for trending topics and viral moments',
      color: 'border-pink-500 bg-pink-50'
    }
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate voice generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with BETA badge */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <h1 className="text-4xl font-bold text-gray-900">🎤 Voice Studio</h1>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 font-bold text-sm rounded-full">BETA</span>
          </div>
          <p className="text-xl text-gray-600">AI-powered voice creation for your content</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Voice Configuration</h3>
              
              {/* Voice Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-4">Select Voice Type</label>
                <div className="space-y-3">
                  {voiceTypes.map((voice) => (
                    <button
                      key={voice.id}
                      onClick={() => setSelectedVoice(voice.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        selectedVoice === voice.id
                          ? voice.color
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{voice.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">{voice.name}</h4>
                          <p className="text-sm text-gray-600">{voice.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Script Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Voice Script</label>
                <textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder="Enter the text you want to convert to voice..."
                  rows={6}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
                <div className="mt-2 text-sm text-gray-500">
                  {script.length}/500 characters
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-3">Advanced Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Speed</label>
                    <select className="w-full p-2 border border-gray-200 rounded-lg text-sm">
                      <option>Normal</option>
                      <option>Slow</option>
                      <option>Fast</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Pitch</label>
                    <select className="w-full p-2 border border-gray-200 rounded-lg text-sm">
                      <option>Natural</option>
                      <option>Higher</option>
                      <option>Lower</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !script.trim()}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  isGenerating || !script.trim()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg hover:scale-105'
                }`}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Generating Voice...</span>
                  </div>
                ) : (
                  'Generate Voice'
                )}
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Voice Preview</h3>
              
              {isGenerating ? (
                <div className="text-center py-12">
                  <div className="animate-pulse">
                    <div className="text-4xl mb-4">🎵</div>
                    <p className="text-gray-600">Generating your voice content...</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🎤</div>
                  <p className="text-gray-600 mb-6">Your generated voice will appear here</p>
                  <div className="bg-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-center space-x-4">
                      <button className="p-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </button>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 rounded-full h-2 w-0"></div>
                      </div>
                      <span className="text-sm text-gray-500">0:00</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Features Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-bold text-gray-900 mb-4">🚀 Voice Studio Features</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span>Multiple voice personalities</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span>Natural-sounding AI voices</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span>Customizable speed and pitch</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span>Export in multiple formats</span>
                </div>
              </div>
              
              <div className="mt-6 p-3 bg-orange-50 rounded-lg">
                <p className="text-orange-800 text-sm font-medium">
                  🏗️ Beta Feature: We're continuously improving voice quality and adding new voices. Share your feedback!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Generations */}
        <div className="mt-12">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Voice Generations</h3>
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📼</div>
              <p className="text-gray-600">Your recent voice generations will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceStudio;