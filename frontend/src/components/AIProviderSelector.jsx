import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Tooltip } from './ui/tooltip';
import { Progress } from './ui/progress';
import { Sparkles, Zap, Brain, Search, Clock, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const AIProviderSelector = ({ selectedProviders, onProvidersChange, disabled = false }) => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState({});

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API = `${BACKEND_URL}/api`;

  // Provider icons mapping
  const providerIcons = {
    openai: Brain,
    anthropic: Sparkles,
    gemini: Zap,
    perplexity: Search
  };

  // Provider colors
  const providerColors = {
    openai: 'bg-green-500',
    anthropic: 'bg-orange-500', 
    gemini: 'bg-blue-500',
    perplexity: 'bg-purple-500'
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await axios.get(`${API}/ai/providers`);
      setProviders(response.data.providers);
      
      // Initialize with available providers if none selected
      if (selectedProviders.length === 0) {
        const availableProviders = response.data.providers
          .filter(p => p.available)
          .map(p => p.provider);
        onProvidersChange(availableProviders.slice(0, 3)); // Default to first 3 available
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast.error('Failed to load AI providers');
    } finally {
      setLoading(false);
    }
  };

  const handleProviderToggle = (providerId) => {
    if (disabled) return;
    
    const isSelected = selectedProviders.includes(providerId);
    let newProviders;
    
    if (isSelected) {
      // Ensure at least one provider is selected
      if (selectedProviders.length === 1) {
        toast.error('At least one AI provider must be selected');
        return;
      }
      newProviders = selectedProviders.filter(p => p !== providerId);
    } else {
      // Limit to 4 providers max for performance
      if (selectedProviders.length >= 4) {
        toast.error('Maximum 4 AI providers can be selected');
        return;
      }
      newProviders = [...selectedProviders, providerId];
    }
    
    onProvidersChange(newProviders);
  };

  const toggleDetails = (providerId) => {
    setShowDetails(prev => ({
      ...prev,
      [providerId]: !prev[providerId]
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Provider Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center space-x-3 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Advanced AI Provider Selection
        </CardTitle>
        <CardDescription>
          Choose your AI models for content generation. Mix and match for best results!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {providers.map((provider) => {
            const Icon = providerIcons[provider.provider] || Brain;
            const isSelected = selectedProviders.includes(provider.provider);
            const isDisabled = disabled || !provider.available;
            
            return (
              <div
                key={provider.provider}
                className={`relative border rounded-lg p-4 transition-all duration-200 ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${
                  isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
                onClick={() => !isDisabled && handleProviderToggle(provider.provider)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg ${providerColors[provider.provider]} flex items-center justify-center text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{provider.name}</h3>
                        <Badge variant={provider.available ? "default" : "secondary"} className="text-xs">
                          {provider.model}
                        </Badge>
                        {provider.available ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {provider.description}
                      </p>
                      
                      {/* Strengths */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {provider.strengths?.slice(0, 3).map((strength, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs px-1 py-0">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Switch
                    checked={isSelected}
                    onCheckedChange={() => handleProviderToggle(provider.provider)}
                    disabled={isDisabled}
                  />
                </div>
                
                {/* Detailed info when expanded */}
                {showDetails[provider.provider] && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <h4 className="font-medium mb-2">Best For:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          {provider.best_for?.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Capabilities:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          {provider.strengths?.map((strength, idx) => (
                            <li key={idx}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Show details toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDetails(provider.provider);
                  }}
                  className="absolute top-2 right-12 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Info className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            );
          })}
        </div>
        
        {/* Selection Summary */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Selected AI Models:</span>
            <Badge variant="outline">{selectedProviders.length}/4</Badge>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedProviders.map(providerId => {
              const provider = providers.find(p => p.provider === providerId);
              const Icon = providerIcons[providerId] || Brain;
              return (
                <div key={providerId} className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                  <Icon className="h-3 w-3" />
                  <span className="text-xs font-medium">{provider?.name}</span>
                </div>
              );
            })}
          </div>
          <Progress value={(selectedProviders.length / 4) * 100} className="h-2" />
          <p className="text-xs text-gray-600 mt-2">
            Using multiple AI providers gives you diverse, high-quality content options.
          </p>
        </div>
        
        {/* Quick Selection Presets */}
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium">Quick Presets:</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const available = providers.filter(p => p.available).map(p => p.provider);
                onProvidersChange(available.slice(0, 2));
              }}
              disabled={disabled}
            >
              <Zap className="h-3 w-3 mr-1" />
              Fast (2 AI)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const available = providers.filter(p => p.available).map(p => p.provider);
                onProvidersChange(available.slice(0, 3));
              }}
              disabled={disabled}
            >
              <Brain className="h-3 w-3 mr-1" />
              Balanced (3 AI)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const available = providers.filter(p => p.available).map(p => p.provider);
                onProvidersChange(available);
              }}
              disabled={disabled}
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Maximum (All AI)
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIProviderSelector;