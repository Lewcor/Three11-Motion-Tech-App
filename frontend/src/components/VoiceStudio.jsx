import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Mic, 
  MicOff, 
  Square, 
  Play, 
  Pause, 
  Volume2, 
  Download, 
  Copy, 
  Wand2, 
  MessageSquare, 
  Hash, 
  Brain,
  Zap,
  Sparkles,
  Upload,
  FileAudio
} from 'lucide-react';

const VoiceStudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [contentResult, setContentResult] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentMode, setCurrentMode] = useState('voice-to-content');
  const [activeTab, setActiveTab] = useState('record');
  const [voiceCommand, setVoiceCommand] = useState('');
  const [commandResult, setCommandResult] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error accessing microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const playAudio = () => {
    if (audioPlayerRef.current) {
      if (isPlaying) {
        audioPlayerRef.current.pause();
      } else {
        audioPlayerRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setAudioBlob(file);
      
      // Reset other states
      setTranscript('');
      setContentResult(null);
      setCommandResult(null);
    }
  };

  const processVoiceContent = async () => {
    if (!audioBlob) return;

    setIsProcessing(true);
    setProcessingStep('Uploading audio...');
    setUploadProgress(20);

    try {
      const formData = new FormData();
      formData.append('audio_file', audioBlob, 'recording.wav');

      const token = localStorage.getItem('authToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;

      setProcessingStep('Transcribing audio...');
      setUploadProgress(40);

      const response = await fetch(`${backendUrl}/api/voice/content-suite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      setProcessingStep('Analyzing content...');
      setUploadProgress(60);

      const data = await response.json();
      
      setProcessingStep('Generating content...');
      setUploadProgress(80);

      if (data.success) {
        setTranscript(data.transcript);
        setContentResult(data);
        setProcessingStep('Complete!');
        setUploadProgress(100);
      } else {
        throw new Error(data.error || 'Processing failed');
      }

    } catch (error) {
      console.error('Error processing voice:', error);
      alert(`Error processing voice: ${error.message}`);
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
      setUploadProgress(0);
    }
  };

  const processVoiceCommand = async () => {
    if (!audioBlob) return;

    setIsProcessing(true);
    setProcessingStep('Processing voice command...');

    try {
      const formData = new FormData();
      formData.append('audio_file', audioBlob, 'command.wav');

      const token = localStorage.getItem('authToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(`${backendUrl}/api/voice/command`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setCommandResult(data);
        setVoiceCommand(data.transcript);
        
        // Handle navigation commands
        if (data.action === 'navigate') {
          setTimeout(() => {
            window.location.href = `/${data.destination}`;
          }, 2000);
        }
      } else {
        throw new Error(data.error || 'Command processing failed');
      }

    } catch (error) {
      console.error('Error processing voice command:', error);
      alert(`Error processing voice command: ${error.message}`);
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const transcribeOnly = async () => {
    if (!audioBlob) return;

    setIsProcessing(true);
    setProcessingStep('Transcribing audio...');

    try {
      const formData = new FormData();
      formData.append('audio_file', audioBlob, 'transcribe.wav');

      const token = localStorage.getItem('authToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(`${backendUrl}/api/voice/transcribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setTranscript(data.transcript);
      } else {
        throw new Error(data.error || 'Transcription failed');
      }

    } catch (error) {
      console.error('Error transcribing audio:', error);
      alert(`Error transcribing audio: ${error.message}`);
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = 'voice-recording.wav';
      a.click();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            <Sparkles className="inline mr-2 text-purple-600" />
            Voice Studio
          </h1>
          <p className="text-gray-600">Revolutionary voice-powered content creation</p>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Voice Controls */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mic className="mr-2 text-purple-600" />
                  Voice Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="record">Record</TabsTrigger>
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="record" className="space-y-4">
                    <div className="text-center">
                      <div className="relative inline-block">
                        <Button
                          onClick={isRecording ? stopRecording : startRecording}
                          disabled={isProcessing}
                          className={`w-20 h-20 rounded-full ${
                            isRecording 
                              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                              : 'bg-purple-600 hover:bg-purple-700'
                          }`}
                        >
                          {isRecording ? (
                            <Square className="w-8 h-8 text-white" />
                          ) : (
                            <Mic className="w-8 h-8 text-white" />
                          )}
                        </Button>
                        {isRecording && (
                          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {formatTime(recordingTime)}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {isRecording ? 'Recording...' : 'Click to record'}
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="upload" className="space-y-4">
                    <div className="text-center">
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleFileUpload}
                        ref={fileInputRef}
                        className="hidden"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="w-full"
                      >
                        <Upload className="mr-2 w-4 h-4" />
                        Upload Audio File
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        Supports MP3, WAV, M4A, OGG, WebM
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Audio Player */}
                {audioUrl && (
                  <div className="space-y-2">
                    <audio
                      ref={audioPlayerRef}
                      src={audioUrl}
                      onEnded={() => setIsPlaying(false)}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={playAudio}
                        variant="outline"
                        size="sm"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button
                        onClick={downloadAudio}
                        variant="outline"
                        size="sm"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Processing Status */}
                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-purple-600 animate-pulse" />
                      <span className="text-sm">{processingStep}</span>
                    </div>
                    {uploadProgress > 0 && (
                      <Progress value={uploadProgress} className="w-full" />
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    onClick={processVoiceContent}
                    disabled={!audioBlob || isProcessing}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Wand2 className="mr-2 w-4 h-4" />
                    Generate Content Suite
                  </Button>
                  
                  <Button
                    onClick={processVoiceCommand}
                    disabled={!audioBlob || isProcessing}
                    variant="outline"
                    className="w-full"
                  >
                    <Zap className="mr-2 w-4 h-4" />
                    Voice Command
                  </Button>
                  
                  <Button
                    onClick={transcribeOnly}
                    disabled={!audioBlob || isProcessing}
                    variant="outline"
                    className="w-full"
                  >
                    <FileAudio className="mr-2 w-4 h-4" />
                    Transcribe Only
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2">
            {/* Transcript */}
            {transcript && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2 text-blue-600" />
                    Transcript
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-800">{transcript}</p>
                    <Button
                      onClick={() => copyToClipboard(transcript)}
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Content Results */}
            {contentResult && contentResult.generated_content && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="mr-2 text-purple-600" />
                    Generated Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Content Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          Category: {contentResult.content_details?.category}
                        </Badge>
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2">
                          Platform: {contentResult.content_details?.platform}
                        </Badge>
                      </div>
                    </div>

                    {/* AI Generated Captions */}
                    {contentResult.generated_content.combined_result && (
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">AI Generated Caption:</h4>
                        <p className="text-gray-800 mb-2">{contentResult.generated_content.combined_result}</p>
                        <Button
                          onClick={() => copyToClipboard(contentResult.generated_content.combined_result)}
                          variant="ghost"
                          size="sm"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    )}

                    {/* Hashtags */}
                    {contentResult.generated_content.hashtags && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center">
                          <Hash className="w-4 h-4 mr-2" />
                          Hashtags:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {contentResult.generated_content.hashtags.map((tag, index) => (
                            <Badge key={index} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          onClick={() => copyToClipboard(contentResult.generated_content.hashtags.join(' '))}
                          variant="ghost"
                          size="sm"
                          className="mt-2"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy All
                        </Button>
                      </div>
                    )}

                    {/* Voice Analysis */}
                    {contentResult.voice_analysis && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Voice Analysis:</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Detected Intent:</strong> {contentResult.voice_analysis.detected_intent}
                        </p>
                        <div className="space-y-1">
                          <strong className="text-sm">Suggestions:</strong>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            {contentResult.voice_analysis.suggested_improvements?.map((suggestion, index) => (
                              <li key={index}>{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Voice Command Results */}
            {commandResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="mr-2 text-yellow-600" />
                    Voice Command Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Command:</strong> {commandResult.transcript}</p>
                    <p><strong>Action:</strong> {commandResult.action}</p>
                    {commandResult.destination && (
                      <p><strong>Destination:</strong> {commandResult.destination}</p>
                    )}
                    {commandResult.action === 'navigate' && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          🚀 Navigating to {commandResult.destination}...
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Getting Started */}
            {!transcript && !contentResult && !commandResult && (
              <Card>
                <CardHeader>
                  <CardTitle>🎙️ Getting Started with Voice Studio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">🎯 Content Generation</h4>
                        <p className="text-sm text-gray-600">
                          Record or upload audio describing your content idea. Our AI will analyze your voice and generate viral captions, hashtags, and content strategies.
                        </p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">🗣️ Voice Commands</h4>
                        <p className="text-sm text-gray-600">
                          Use natural voice commands like "Create content about fitness" or "Navigate to premium" for hands-free operation.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">💡 Pro Tips</h4>
                      <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                        <li>Speak clearly and describe your target audience</li>
                        <li>Mention the platform you're creating for (TikTok, Instagram, etc.)</li>
                        <li>Include key points you want to highlight</li>
                        <li>Use voice commands for quick navigation</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceStudio;