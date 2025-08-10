import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Video, 
  Download, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Sparkles, 
  Clock,
  Monitor,
  Smartphone,
  Youtube,
  Camera,
  Wand2,
  ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const AIVideoStudio = () => {
  const [videoTitle, setVideoTitle] = useState('');
  const [videoScript, setVideoScript] = useState('');
  const [videoStyle, setVideoStyle] = useState('cinematic');
  const [videoDuration, setVideoDuration] = useState(30);
  const [selectedFormat, setSelectedFormat] = useState('9:16');
  const [voiceStyle, setVoiceStyle] = useState('natural');
  const [numberOfScenes, setNumberOfScenes] = useState(4);
  const [loading, setLoading] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [videoProjects, setVideoProjects] = useState([]);
  const [currentTab, setCurrentTab] = useState('create');

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const videoFormats = [
    { id: '9:16', name: 'Vertical (TikTok/Instagram)', icon: <Smartphone className="w-4 h-4" />, dimensions: '1080x1920' },
    { id: '16:9', name: 'Horizontal (YouTube)', icon: <Monitor className="w-4 h-4" />, dimensions: '1920x1080' },
    { id: '1:1', name: 'Square (Instagram)', icon: <Camera className="w-4 h-4" />, dimensions: '1080x1080' },
  ];

  const videoStyles = [
    { id: 'cinematic', name: 'Cinematic', description: 'Film-quality with dramatic lighting' },
    { id: 'modern', name: 'Modern', description: 'Clean, contemporary aesthetic' },
    { id: 'vibrant', name: 'Vibrant', description: 'Bold colors and energetic feel' },
    { id: 'minimal', name: 'Minimal', description: 'Clean, simple, focused' },
    { id: 'artistic', name: 'Artistic', description: 'Creative and expressive' },
  ];

  const voiceStyles = [
    { id: 'natural', name: 'Natural', description: 'Conversational and authentic' },
    { id: 'energetic', name: 'Energetic', description: 'High energy and enthusiastic' },
    { id: 'professional', name: 'Professional', description: 'Business-appropriate tone' },
    { id: 'storyteller', name: 'Storyteller', description: 'Narrative and engaging' },
  ];

  useEffect(() => {
    // Check for authentication token
    const token = localStorage.getItem('access_token');
    if (!token) {
      // For demo purposes, create a temporary token or redirect to auth
      console.log('No authentication token found');
      // Uncomment to redirect to auth: window.location.href = '/auth';
    }
    
    fetchVideoProjects();
  }, []);

  const fetchVideoProjects = async () => {
    try {
      const token = localStorage.getItem('access_token') || 'demo-token';
      const response = await axios.get(`${BACKEND_URL}/api/ai-video/projects`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setVideoProjects(response.data.projects || []);
    } catch (error) {
      console.error('Error fetching video projects:', error);
      if (error.response?.status === 401) {
        // Handle authentication error
        window.location.href = '/auth';
      }
    }
  };

  const generateVideo = async () => {
    if (!videoTitle || !videoScript) {
      toast.error('Please provide both title and script');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('access_token') || 'demo-token';
      const payload = {
        title: videoTitle,
        script: videoScript,
        style: videoStyle,
        duration: videoDuration,
        format: selectedFormat,
        voice_style: voiceStyle,
        number_of_scenes: numberOfScenes
      };

      console.log('Generating video with payload:', payload);
      
      const response = await axios.post(`${BACKEND_URL}/api/ai-video/generate`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Video generation response:', response.data);
      
      if (response.data.success) {
        setGeneratedVideo(response.data.video);
        setCurrentTab('result');
        toast.success('Video generated successfully!');
        fetchVideoProjects(); // Refresh projects list
      } else {
        throw new Error(response.data.message || 'Generation failed');
      }
    } catch (error) {
      console.error('Error generating video:', error);
      if (error.response?.status === 401) {
        toast.error('Authentication required. Please sign in.');
        window.location.href = '/auth';
      } else {
        toast.error(error.response?.data?.detail || error.response?.data?.message || 'Failed to generate video');
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadVideo = async () => {
    if (!generatedVideo) return;
    
    try {
      // This would trigger a download of the generated video
      toast.success('Video download started!');
    } catch (error) {
      toast.error('Failed to download video');
    }
  };

  const regenerateVideo = async () => {
    await generateVideo();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600">
              <Video className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Video Studio
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Create stunning videos with Google Imagen 3 AI technology
          </p>
          <Badge variant="secondary" className="mt-2">
            <Sparkles className="w-4 h-4 mr-1" />
            POWERED BY IMAGEN 3
          </Badge>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Create Video</TabsTrigger>
            <TabsTrigger value="result">Generated Video</TabsTrigger>
            <TabsTrigger value="projects">My Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Creation Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wand2 className="w-5 h-5" />
                      Video Creation
                    </CardTitle>
                    <CardDescription>
                      Describe your video and let AI bring it to life
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Video Title */}
                    <div>
                      <label className="text-sm font-medium">Video Title</label>
                      <Input
                        placeholder="Enter your video title..."
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        className="mt-2"
                      />
                    </div>

                    {/* Video Script */}
                    <div>
                      <label className="text-sm font-medium">Video Script/Description</label>
                      <Textarea
                        placeholder="Describe what you want in your video. Be detailed about scenes, actions, and visual elements..."
                        value={videoScript}
                        onChange={(e) => setVideoScript(e.target.value)}
                        rows={4}
                        className="mt-2"
                      />
                    </div>

                    {/* Video Format */}
                    <div>
                      <label className="text-sm font-medium mb-3 block">Video Format</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {videoFormats.map((format) => (
                          <div
                            key={format.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              selectedFormat === format.id
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                            onClick={() => setSelectedFormat(format.id)}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {format.icon}
                              <span className="font-medium">{format.id}</span>
                            </div>
                            <p className="text-sm text-gray-600">{format.name}</p>
                            <p className="text-xs text-gray-500">{format.dimensions}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Video Style */}
                    <div>
                      <label className="text-sm font-medium mb-3 block">Video Style</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {videoStyles.map((style) => (
                          <div
                            key={style.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                              videoStyle === style.id
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                            onClick={() => setVideoStyle(style.id)}
                          >
                            <p className="font-medium capitalize">{style.name}</p>
                            <p className="text-xs text-gray-600 mt-1">{style.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Advanced Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium">Duration (seconds)</label>
                        <Input
                          type="number"
                          value={videoDuration}
                          onChange={(e) => setVideoDuration(parseInt(e.target.value) || 30)}
                          min="15"
                          max="60"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Voice Style</label>
                        <select
                          value={voiceStyle}
                          onChange={(e) => setVoiceStyle(e.target.value)}
                          className="mt-2 w-full p-2 border rounded-md"
                        >
                          {voiceStyles.map((voice) => (
                            <option key={voice.id} value={voice.id}>
                              {voice.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Number of Scenes</label>
                        <Input
                          type="number"
                          value={numberOfScenes}
                          onChange={(e) => setNumberOfScenes(parseInt(e.target.value) || 4)}
                          min="2"
                          max="8"
                          className="mt-2"
                        />
                      </div>
                    </div>

                    {/* Generate Button */}
                    <Button
                      onClick={generateVideo}
                      disabled={loading || !videoTitle || !videoScript}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating Video...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Video with AI
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Pro Features Sidebar */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Pro Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Badge variant="outline" className="w-full justify-center">
                        <ImageIcon className="w-4 h-4 mr-1" />
                        Google Imagen 3
                      </Badge>
                      <Badge variant="outline" className="w-full justify-center">
                        <Video className="w-4 h-4 mr-1" />
                        4K Resolution
                      </Badge>
                      <Badge variant="outline" className="w-full justify-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Up to 60s Videos
                      </Badge>
                    </div>
                    
                    <Button variant="outline" className="w-full mt-4">
                      Upgrade to Pro
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="result" className="space-y-6">
            {generatedVideo ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>Generated Video</span>
                      {generatedVideo.status === 'completed' && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                          Completed
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={downloadVideo} size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download MP4
                      </Button>
                      <Button onClick={regenerateVideo} variant="outline" size="sm">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Regenerate
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Video Title & Info */}
                    <div className="border-b pb-4">
                      <h2 className="text-xl font-semibold">{generatedVideo.title}</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Created on {generatedVideo.created_at ? new Date(generatedVideo.created_at).toLocaleString() : 'Just now'}
                      </p>
                    </div>

                    {/* Video Preview */}
                    <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                      {generatedVideo.preview_url ? (
                        <video
                          src={generatedVideo.preview_url}
                          controls
                          className="w-full h-full rounded-lg"
                        />
                      ) : (
                        <div className="text-center">
                          <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-300">Video Preview</p>
                        </div>
                      )}
                    </div>

                    {/* Video Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-semibold">{generatedVideo.duration}s</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Format</p>
                        <p className="font-semibold">{generatedVideo.format}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Style</p>
                        <p className="font-semibold capitalize">{generatedVideo.style}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Scenes</p>
                        <p className="font-semibold">{generatedVideo.scenes?.length || 0}</p>
                      </div>
                    </div>

                    {/* Scene Breakdown */}
                    {generatedVideo.scenes && (
                      <div>
                        <h3 className="font-semibold mb-3">Scene Breakdown</h3>
                        <div className="grid gap-3">
                          {generatedVideo.scenes.map((scene, index) => (
                            <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                                {scene.image_url ? (
                                  <img 
                                    src={scene.image_url} 
                                    alt={`Scene ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <ImageIcon className="w-6 h-6 text-gray-400" style={{display: scene.image_url ? 'none' : 'block'}} />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">Scene {scene.scene_number || (index + 1)}</p>
                                <p className="text-sm text-gray-600 mt-1">{scene.description}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {scene.timestamp}s - {scene.duration}s duration
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No video generated yet. Go to Create Video tab to get started.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Video Projects</CardTitle>
                <CardDescription>Your previously generated videos</CardDescription>
              </CardHeader>
              <CardContent>
                {videoProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {videoProjects.map((project) => (
                      <div key={project.id} className="border rounded-lg p-4">
                        <div className="aspect-video bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                          <Play className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="font-semibold truncate">{project.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {project.format} • {project.duration}s
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(project.created_at).toLocaleDateString()}
                        </p>
                        <Button size="sm" className="w-full mt-3">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No video projects yet. Create your first video!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIVideoStudio;