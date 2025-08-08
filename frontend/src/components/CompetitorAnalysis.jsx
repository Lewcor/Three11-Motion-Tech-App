import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Search, 
  Target, 
  TrendingUp,
  Eye,
  Users,
  BarChart3,
  Zap,
  AlertTriangle,
  CheckCircle,
  BrainCircuit,
  Sparkles,
  RefreshCw,
  Plus,
  ArrowRight,
  Trophy,
  TrendingDown,
  Lightbulb
} from 'lucide-react';

const CompetitorAnalysis = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [competitors, setCompetitors] = useState([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [competitiveContent, setCompetitiveContent] = useState(null);
  const [gapAnalysis, setGapAnalysis] = useState(null);

  useEffect(() => {
    loadUserCompetitors();
  }, []);

  const loadUserCompetitors = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      
      const response = await fetch(`${backendUrl}/api/competitor/list`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCompetitors(data.competitors || []);
      }
    } catch (error) {
      console.error('Error loading competitors:', error);
    }
  };

  const discoverCompetitor = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      
      const response = await fetch(`${backendUrl}/api/competitor/discover`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedCompetitor(data.profile);
        setCompetitors([data.profile, ...competitors]);
        setActiveTab('analysis');
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error discovering competitor:', error);
      alert('Error discovering competitor');
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeCompetitorStrategy = async (competitorId) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      
      const response = await fetch(`${backendUrl}/api/competitor/${competitorId}/analyze-strategy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysisResults(data.insights);
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error analyzing strategy:', error);
      alert('Error analyzing competitor strategy');
    } finally {
      setIsLoading(false);
    }
  };

  const generateCompetitiveContent = async (competitorId, contentType = 'viral_posts') => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      
      const response = await fetch(`${backendUrl}/api/competitor/${competitorId}/generate-content`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content_type: contentType }),
      });

      if (response.ok) {
        const data = await response.json();
        setCompetitiveContent(data.content);
        setActiveTab('content');
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error generating competitive content:', error);
      alert('Error generating competitive content');
    } finally {
      setIsLoading(false);
    }
  };

  const performGapAnalysis = async (competitorId) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
      
      const response = await fetch(`${backendUrl}/api/competitor/${competitorId}/gap-analysis`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGapAnalysis(data.gaps);
        setActiveTab('gaps');
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error performing gap analysis:', error);
      alert('Error performing gap analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const parseAIResponse = (response) => {
    try {
      if (typeof response === 'string') {
        return JSON.parse(response);
      }
      return response;
    } catch (error) {
      return { error: 'Unable to parse response', raw: response };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            <Target className="inline mr-2 text-purple-600" />
            AI-Powered Competitor Analysis
          </h1>
          <p className="text-gray-600">Outsmart your competition with intelligent insights and content generation</p>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="analysis">Strategy Analysis</TabsTrigger>
            <TabsTrigger value="content">Beat Their Content</TabsTrigger>
            <TabsTrigger value="gaps">Gap Analysis</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>

          {/* Competitor Discovery Tab */}
          <TabsContent value="discover" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Discover Competitors
                </CardTitle>
                <CardDescription>
                  Enter a competitor name, social media handle, or website URL to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <Input
                    placeholder="Enter competitor name, @handle, or URL..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && discoverCompetitor()}
                  />
                  <Button 
                    onClick={discoverCompetitor} 
                    disabled={isLoading || !searchQuery.trim()}
                    className="flex items-center gap-2"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    Analyze
                  </Button>
                </div>

                {/* Existing Competitors */}
                {competitors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Your Analyzed Competitors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {competitors.map((competitor, index) => (
                        <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow"
                              onClick={() => setSelectedCompetitor(competitor)}>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">{competitor.name}</CardTitle>
                            <CardDescription>
                              Added {new Date(competitor.created_at).toLocaleDateString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex justify-between items-center">
                              <Badge variant="outline">
                                {Object.keys(competitor.platforms || {}).length} platforms
                              </Badge>
                              <Button size="sm" variant="ghost">
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Strategy Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            {selectedCompetitor ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5" />
                        Strategy Analysis: {selectedCompetitor.name}
                      </span>
                      <Button 
                        onClick={() => analyzeCompetitorStrategy(selectedCompetitor.competitor_id)}
                        disabled={isLoading}
                        size="sm"
                      >
                        {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Analyze Strategy'}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analysisResults ? (
                      <div className="space-y-6">
                        {/* Display AI Analysis Results */}
                        {Object.entries(parseAIResponse(analysisResults.synthesized_analysis || analysisResults)).map(([key, value], index) => (
                          <div key={index} className="border-l-4 border-purple-500 pl-4">
                            <h4 className="font-semibold capitalize mb-2">{key.replace(/_/g, ' ')}</h4>
                            <div className="text-gray-700">
                              {typeof value === 'string' ? (
                                <p>{value}</p>
                              ) : Array.isArray(value) ? (
                                <ul className="list-disc list-inside space-y-1">
                                  {value.map((item, i) => (
                                    <li key={i}>{typeof item === 'string' ? item : JSON.stringify(item)}</li>
                                  ))}
                                </ul>
                              ) : (
                                <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                                  {JSON.stringify(value, null, 2)}
                                </pre>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BrainCircuit className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Click "Analyze Strategy" to get AI-powered insights</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    className="h-20 flex-col gap-2"
                    onClick={() => generateCompetitiveContent(selectedCompetitor.competitor_id)}
                    disabled={isLoading}
                  >
                    <Trophy className="w-6 h-6" />
                    Beat Their Content
                  </Button>
                  <Button 
                    className="h-20 flex-col gap-2" 
                    variant="outline"
                    onClick={() => performGapAnalysis(selectedCompetitor.competitor_id)}
                    disabled={isLoading}
                  >
                    <Lightbulb className="w-6 h-6" />
                    Find Gaps
                  </Button>
                  <Button 
                    className="h-20 flex-col gap-2" 
                    variant="outline"
                    onClick={() => setActiveTab('dashboard')}
                  >
                    <BarChart3 className="w-6 h-6" />
                    View Dashboard
                  </Button>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Competitor Selected</h3>
                  <p className="text-gray-500 mb-4">Discover a competitor first to analyze their strategy</p>
                  <Button onClick={() => setActiveTab('discover')}>
                    <Search className="w-4 h-4 mr-2" />
                    Discover Competitors
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Competitive Content Tab */}
          <TabsContent value="content" className="space-y-6">
            {competitiveContent ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Content to Outperform {selectedCompetitor?.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {Object.entries(parseAIResponse(competitiveContent.synthesized_analysis || competitiveContent)).map(([key, value], index) => (
                        <Card key={index} className="border-l-4 border-green-500">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg capitalize">{key.replace(/_/g, ' ')}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {typeof value === 'string' ? (
                              <p className="whitespace-pre-wrap">{value}</p>
                            ) : Array.isArray(value) ? (
                              <div className="space-y-3">
                                {value.map((item, i) => (
                                  <div key={i} className="bg-green-50 p-3 rounded-lg">
                                    {typeof item === 'string' ? (
                                      <p>{item}</p>
                                    ) : (
                                      <div>
                                        {Object.entries(item).map(([subKey, subValue]) => (
                                          <div key={subKey} className="mb-2">
                                            <strong className="capitalize">{subKey.replace(/_/g, ' ')}:</strong>
                                            <span className="ml-2">{typeof subValue === 'string' ? subValue : JSON.stringify(subValue)}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                                {JSON.stringify(value, null, 2)}
                              </pre>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Competitive Content Generated</h3>
                  <p className="text-gray-500 mb-4">Generate content designed to outperform your competitors</p>
                  {selectedCompetitor ? (
                    <Button onClick={() => generateCompetitiveContent(selectedCompetitor.competitor_id)}>
                      <Trophy className="w-4 h-4 mr-2" />
                      Generate Superior Content
                    </Button>
                  ) : (
                    <Button onClick={() => setActiveTab('discover')}>
                      <Search className="w-4 h-4 mr-2" />
                      Select Competitor First
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Gap Analysis Tab */}
          <TabsContent value="gaps" className="space-y-6">
            {gapAnalysis ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      Opportunity Gaps: {selectedCompetitor?.name}
                    </CardTitle>
                    <CardDescription>
                      Strategic opportunities your competitor is missing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {Object.entries(parseAIResponse(gapAnalysis.synthesized_analysis || gapAnalysis)).map(([key, value], index) => (
                        <Card key={index} className="border-l-4 border-yellow-500">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg capitalize flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 text-yellow-600" />
                              {key.replace(/_/g, ' ')}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {typeof value === 'string' ? (
                              <p className="whitespace-pre-wrap">{value}</p>
                            ) : Array.isArray(value) ? (
                              <div className="space-y-3">
                                {value.map((item, i) => (
                                  <div key={i} className="bg-yellow-50 p-3 rounded-lg border-l-2 border-yellow-300">
                                    {typeof item === 'string' ? (
                                      <p>{item}</p>
                                    ) : (
                                      <div>
                                        {Object.entries(item).map(([subKey, subValue]) => (
                                          <div key={subKey} className="mb-2">
                                            <strong className="capitalize text-yellow-800">{subKey.replace(/_/g, ' ')}:</strong>
                                            <span className="ml-2">{typeof subValue === 'string' ? subValue : JSON.stringify(subValue)}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                                {JSON.stringify(value, null, 2)}
                              </pre>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Gap Analysis Available</h3>
                  <p className="text-gray-500 mb-4">Discover opportunities your competitors are missing</p>
                  {selectedCompetitor ? (
                    <Button onClick={() => performGapAnalysis(selectedCompetitor.competitor_id)}>
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Find Strategic Gaps
                    </Button>
                  ) : (
                    <Button onClick={() => setActiveTab('discover')}>
                      <Search className="w-4 h-4 mr-2" />
                      Select Competitor First
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Competitors Analyzed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">{competitors.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Strategy Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {analysisResults ? '1' : '0'}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Content Generated</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {competitiveContent ? '1' : '0'}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Gaps Identified</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">
                    {gapAnalysis ? '1' : '0'}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Competitor Analysis Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competitors.slice(0, 5).map((competitor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{competitor.name}</h4>
                        <p className="text-sm text-gray-600">
                          Added {new Date(competitor.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedCompetitor(competitor);
                          setActiveTab('analysis');
                        }}
                      >
                        View Analysis
                      </Button>
                    </div>
                  ))}
                  {competitors.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No competitors analyzed yet. Start by discovering your first competitor!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Loading State */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg flex items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
              <span>Analyzing competitor intelligence...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitorAnalysis;