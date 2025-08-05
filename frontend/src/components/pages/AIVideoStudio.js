import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AIVideoStudio = () => {
  const [formData, setFormData] = useState({
    title: '',
    script: '',
    video_format: 'tiktok',
    voice_style: 'professional',
    number_of_scenes: 4
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [videoProjects, setVideoProjects] = useState([]);
  const [showProjects, setShowProjects] = useState(false);

  const videoFormats = {
    tiktok: { name: 'TikTok/Instagram Reels', ratio: '9:16', duration: '15-60s', icon: '📱' },
    youtube_shorts: { name: 'YouTube Shorts', ratio: '9:16', duration: 'up to 60s', icon: '🎬' },
    youtube_standard: { name: 'YouTube Standard', ratio: '16:9', duration: '30s-10min', icon: '📺' }
  };

  const voiceStyles = [
    { value: 'professional', name: 'Professional', icon: '👔' },
    { value: 'friendly', name: 'Friendly', icon: '😊' },
    { value: 'energetic', name: 'Energetic', icon: '⚡' },
    { value: 'calm', name: 'Calm & Soothing', icon: '🧘' }
  ];

  useEffect(() => {
    loadVideoProjects();
  }, []);

  const loadVideoProjects = async () => {
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/video/projects`);
      if (response.ok) {
        const projects = await response.json();
        setVideoProjects(projects);
      }
    } catch (error) {
      console.error('Error loading video projects:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerateVideo = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.script.trim()) {
      alert('Please fill in both title and script fields.');
      return;
    }

    setIsGenerating(true);
    setGeneratedVideo(null);

    try {
      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/video/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const videoProject = await response.json();
        setGeneratedVideo(videoProject);
        loadVideoProjects(); // Refresh projects list
      } else {
        const error = await response.json();
        alert(`Error generating video: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error generating video:', error);
      alert('Failed to generate video. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDuration = (seconds) => {
    return `${seconds}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <span className="text-5xl">🎬</span>
            <h1 className="text-4xl font-bold text-gray-900">AI Video Studio</h1>
            <span className="px-3 py-1 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold">
              POWERED BY IMAGEN 3
            </span>
          </div>
          <p className="text-xl text-gray-600 mb-6">
            Create stunning videos with AI-generated images and professional narration
          </p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm border">
              ✨ Google Imagen 3 AI
            </span>
            <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm border">
              🎤 Text-to-Speech
            </span>
            <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm border">
              📱 Multi-Format Export
            </span>
            <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm border">
              🚀 Professional Quality
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Video Creation Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">🎥</span>
                Create New Video
              </h2>

              <form onSubmit={handleGenerateVideo} className="space-y-6">
                
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Video Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="Enter your video title..."
                    required
                  />
                </div>

                {/* Script */}
                <div>
                  <label htmlFor="script" className="block text-sm font-medium text-gray-700 mb-2">
                    Video Script
                  </label>
                  <textarea
                    id="script"
                    name="script"
                    value={formData.script}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Write your video script here. Each sentence will become a scene with an AI-generated image..."
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    💡 Tip: Each sentence will create a new scene. Aim for 3-6 sentences for best results.
                  </p>
                </div>

                {/* Video Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Video Format
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Object.entries(videoFormats).map(([key, format]) => (
                      <label
                        key={key}
                        className={`
                          flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all
                          ${formData.video_format === key 
                            ? 'border-purple-500 bg-purple-50 text-purple-700' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name="video_format"
                          value={key}
                          checked={formData.video_format === key}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{format.icon}</span>
                          <div>
                            <div className="font-medium">{format.name}</div>
                            <div className="text-sm text-gray-500">{format.ratio} • {format.duration}</div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Voice Style */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Voice Style
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {voiceStyles.map((voice) => (
                      <label
                        key={voice.value}
                        className={`
                          flex flex-col items-center p-3 border-2 rounded-xl cursor-pointer transition-all
                          ${formData.voice_style === voice.value 
                            ? 'border-purple-500 bg-purple-50 text-purple-700' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name="voice_style"
                          value={voice.value}
                          checked={formData.voice_style === voice.value}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <span className="text-2xl mb-1">{voice.icon}</span>
                        <span className="text-sm font-medium">{voice.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Number of Scenes */}
                <div>
                  <label htmlFor="number_of_scenes" className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Scenes: {formData.number_of_scenes}
                  </label>
                  <input
                    type="range"
                    id="number_of_scenes"
                    name="number_of_scenes"
                    min="2"
                    max="8"
                    value={formData.number_of_scenes}
                    onChange={handleInputChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>2 scenes</span>
                    <span>8 scenes</span>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  type="submit"
                  disabled={isGenerating}
                  className={`
                    w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200
                    ${isGenerating 
                      ? 'bg-gray-400 cursor-not-allowed text-white' 
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                    }
                  `}
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Generating Video...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>🎬</span>
                      <span>Generate AI Video</span>
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar - Results & Projects */}
          <div className="space-y-6">
            
            {/* Generated Video Preview */}
            {generatedVideo && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">✅</span>
                  Video Generated!
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">{generatedVideo.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{generatedVideo.script}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-700">Generated Scenes ({generatedVideo.scenes.length})</h5>
                    {generatedVideo.scenes.map((scene, index) => (
                      <div key={scene.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-start space-x-3">
                          <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-full">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            {scene.image_base64 && (
                              <img 
                                src={`data:image/png;base64,${scene.image_base64}`}
                                alt={`Scene ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg mb-2"
                              />
                            )}
                            <p className="text-sm text-gray-600 mb-1">{scene.text}</p>
                            <span className="text-xs text-gray-500">Duration: {formatDuration(scene.duration)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <button className="flex-1 py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-medium hover:from-green-600 hover:to-emerald-600 transition-colors">
                        📥 Download MP4
                      </button>
                      <button className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-cyan-600 transition-colors">
                        🔄 Regenerate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* My Projects */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <span className="mr-2">📂</span>
                  My Projects
                </h3>
                <button
                  onClick={() => setShowProjects(!showProjects)}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  {showProjects ? 'Hide' : 'Show All'}
                </button>
              </div>
              
              {showProjects && (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {videoProjects.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No projects yet. Create your first video!</p>
                  ) : (
                    videoProjects.slice(0, 5).map((project) => (
                      <div key={project.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">{project.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {project.scenes.length} scenes • {videoFormats[project.video_format]?.name}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`
                              px-2 py-1 text-xs rounded-full font-medium
                              ${project.status === 'completed' ? 'bg-green-100 text-green-700' :
                                project.status === 'generating' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'}
                            `}>
                              {project.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Feature Info */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-3">🚀 Pro Features</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <span>✅</span>
                  <span>Google Imagen 3 AI Images</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>✅</span>
                  <span>Multiple Voice Styles</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>✅</span>
                  <span>All Video Formats</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>✅</span>
                  <span>Unlimited Projects</span>
                </li>
              </ul>
              
              <Link 
                to="/competitive-pricing"
                className="inline-block mt-4 py-2 px-4 bg-white text-purple-600 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                Upgrade to Premium
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIVideoStudio;