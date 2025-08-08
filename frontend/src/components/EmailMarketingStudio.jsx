import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Mail, Target, Users, Copy, Eye, TrendingUp, Send, Zap, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import AIProviderSelector from './AIProviderSelector';
import axios from 'axios';

const EmailMarketingStudio = () => {
  const [campaignName, setCampaignName] = useState('');
  const [emailType, setEmailType] = useState('email_marketing');
  const [subjectLineIdeas, setSubjectLineIdeas] = useState(5);
  const [targetAudience, setTargetAudience] = useState('');
  const [campaignGoal, setCampaignGoal] = useState('conversion');
  const [keyMessage, setKeyMessage] = useState('');
  const [callToAction, setCallToAction] = useState('');
  const [brandVoice, setBrandVoice] = useState('professional');
  const [includePersonalization, setIncludePersonalization] = useState(true);
  const [emailLength, setEmailLength] = useState('medium');
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [emailHistory, setEmailHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API = `${BACKEND_URL}/api`;

  const emailTypes = [
    { 
      id: 'email_marketing', 
      name: 'Marketing Email', 
      description: 'Sales-focused, conversion-driven campaigns',
      icon: '📈'
    },
    { 
      id: 'email_newsletter', 
      name: 'Newsletter', 
      description: 'Informative, value-driven content',
      icon: '📰'
    },
    { 
      id: 'email_sequence', 
      name: 'Email Sequence', 
      description: 'Part of nurture series or drip campaign',
      icon: '📋'
    }
  ];

  const campaignGoals = [
    { id: 'conversion', name: 'Conversion', description: 'Drive sales or sign-ups' },
    { id: 'engagement', name: 'Engagement', description: 'Increase interaction and clicks' },
    { id: 'information', name: 'Information', description: 'Educate and inform' },
    { id: 'promotion', name: 'Promotion', description: 'Promote products or services' }
  ];

  const brandVoices = [
    { id: 'professional', name: 'Professional', description: 'Formal and authoritative' },
    { id: 'friendly', name: 'Friendly', description: 'Warm and approachable' },
    { id: 'casual', name: 'Casual', description: 'Relaxed and conversational' },
    { id: 'authoritative', name: 'Authoritative', description: 'Expert and commanding' }
  ];

  const emailLengths = [
    { id: 'short', name: 'Short', description: '100-200 words, quick read' },
    { id: 'medium', name: 'Medium', description: '200-400 words, balanced' },
    { id: 'long', name: 'Long', description: '400-800 words, comprehensive' }
  ];

  useEffect(() => {
    fetchEmailHistory();
    fetchAnalytics();
  }, []);

  const fetchEmailHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/email/campaigns`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmailHistory(response.data);
    } catch (error) {
      console.error('Error fetching email history:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/email/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleGenerate = async () => {
    if (!campaignName.trim() || !targetAudience.trim() || !keyMessage.trim() || !callToAction.trim() || selectedProviders.length === 0) {
      toast.error('Please fill all required fields and select AI providers');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API}/email/content`, {
        campaign_name: campaignName,
        email_type: emailType,
        subject_line_ideas: subjectLineIdeas,
        target_audience: targetAudience,
        campaign_goal: campaignGoal,
        key_message: keyMessage,
        call_to_action: callToAction,
        brand_voice: brandVoice,
        include_personalization: includePersonalization,
        email_length: emailLength,
        ai_providers: selectedProviders
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setResults(response.data);
      toast.success('Email content generated successfully!');
      fetchEmailHistory();
      fetchAnalytics();
    } catch (error) {
      console.error('Error generating email content:', error);
      toast.error(error.response?.data?.detail || 'Failed to generate email content');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getGoalIcon = (goal) => {
    switch (goal) {
      case 'conversion': return '💳';
      case 'engagement': return '💬';
      case 'information': return '📚';
      case 'promotion': return '🎯';
      default: return '📧';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
          Email Marketing Studio
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Create compelling email campaigns that convert and engage
        </p>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Campaign</TabsTrigger>
          <TabsTrigger value="history">Campaign History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Campaign Setup
                  </CardTitle>
                  <CardDescription>
                    Basic information about your email campaign
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Campaign Name *</label>
                    <Input
                      placeholder="e.g., Black Friday Sale 2024"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Target Audience *</label>
                    <Input
                      placeholder="e.g., Small business owners, age 25-45, interested in productivity tools"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Subject Line Ideas</label>
                      <Input
                        type="number"
                        min="3"
                        max="10"
                        value={subjectLineIdeas}
                        onChange={(e) => setSubjectLineIdeas(parseInt(e.target.value) || 5)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email Length</label>
                      <select
                        value={emailLength}
                        onChange={(e) => setEmailLength(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      >
                        {emailLengths.map(length => (
                          <option key={length.id} value={length.id}>
                            {length.name} - {length.description}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Email Type & Goal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-3">Email Type</label>
                    <div className="grid grid-cols-1 gap-3">
                      {emailTypes.map((type) => (
                        <Button
                          key={type.id}
                          variant={emailType === type.id ? 'default' : 'outline'}
                          className="h-16 justify-start text-left"
                          onClick={() => setEmailType(type.id)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{type.icon}</span>
                            <div>
                              <div className="font-medium">{type.name}</div>
                              <div className="text-xs opacity-70">{type.description}</div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Campaign Goal</label>
                    <div className="grid grid-cols-2 gap-3">
                      {campaignGoals.map((goal) => (
                        <Button
                          key={goal.id}
                          variant={campaignGoal === goal.id ? 'default' : 'outline'}
                          className="h-16 flex-col gap-1"
                          onClick={() => setCampaignGoal(goal.id)}
                        >
                          <span className="text-lg">{getGoalIcon(goal.id)}</span>
                          <span className="font-medium text-sm">{goal.name}</span>
                          <span className="text-xs opacity-70">{goal.description}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content & Voice</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Key Message *</label>
                    <Textarea
                      placeholder="What's the main message or value proposition you want to communicate?"
                      value={keyMessage}
                      onChange={(e) => setKeyMessage(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Call to Action *</label>
                    <Input
                      placeholder="e.g., Shop Now, Sign Up Today, Download Free Guide"
                      value={callToAction}
                      onChange={(e) => setCallToAction(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Brand Voice</label>
                    <div className="grid grid-cols-2 gap-3">
                      {brandVoices.map((voice) => (
                        <Button
                          key={voice.id}
                          variant={brandVoice === voice.id ? 'default' : 'outline'}
                          className="h-16 flex-col gap-1"
                          onClick={() => setBrandVoice(voice.id)}
                        >
                          <span className="font-medium text-sm">{voice.name}</span>
                          <span className="text-xs opacity-70">{voice.description}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="personalization"
                      checked={includePersonalization}
                      onChange={(e) => setIncludePersonalization(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="personalization" className="text-sm font-medium flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Include personalization tags
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
                disabled={loading || !campaignName.trim() || !targetAudience.trim() || !keyMessage.trim() || !callToAction.trim() || selectedProviders.length === 0}
                className="w-full h-12 text-lg"
                size="lg"
              >
                {loading ? (
                  <>
                    <Zap className="mr-2 h-5 w-5 animate-spin" />
                    Generating Campaign...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Generate Email Campaign
                  </>
                )}
              </Button>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {results ? (
                <div className="space-y-6">
                  {/* Subject Lines */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Subject Lines ({results.subject_lines?.length || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {results.subject_lines?.map((subject, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="text-sm flex-1">{subject}</span>
                            <Button
                              onClick={() => copyToClipboard(subject)}
                              variant="ghost"
                              size="sm"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Preview Text */}
                  {results.preview_text && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          Preview Text
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm flex-1">{results.preview_text}</span>
                          <Button
                            onClick={() => copyToClipboard(results.preview_text)}
                            variant="ghost"
                            size="sm"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Email Content */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="h-5 w-5" />
                          Email Content
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {results.estimated_read_time}min read
                          </Badge>
                          <Button
                            onClick={() => copyToClipboard(results.email_content)}
                            variant="outline"
                            size="sm"
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy All
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 bg-white border rounded-lg max-h-96 overflow-y-auto">
                        <pre className="text-sm whitespace-pre-wrap font-sans">{results.email_content}</pre>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Personalization Tags */}
                  {results.personalization_tags && results.personalization_tags.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Personalization Tags ({results.personalization_tags.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {results.personalization_tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => copyToClipboard(`{{${tag}}}`)}>
                              {`{{${tag}}}`}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* A/B Variations */}
                  {results.a_b_variations && results.a_b_variations.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          A/B Test Variations ({results.a_b_variations.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {results.a_b_variations.map((variation, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <Badge className="text-xs">{variation.version}</Badge>
                                <Button
                                  onClick={() => copyToClipboard(`Subject: ${variation.subject}\n\n${variation.content}`)}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <span className="text-sm font-medium">Subject: </span>
                                  <span className="text-sm">{variation.subject}</span>
                                </div>
                                <div className="text-sm bg-gray-50 p-2 rounded">
                                  {variation.content}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                    <Mail className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>Your generated email campaign will appear here</p>
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
                <Mail className="h-5 w-5" />
                Campaign History
              </CardTitle>
              <CardDescription>
                Your previously generated email campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {emailHistory.length > 0 ? (
                <div className="space-y-4">
                  {emailHistory.map((campaign) => (
                    <div key={campaign.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{campaign.campaign_name || 'Untitled Campaign'}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className="text-xs">
                            {campaign.email_type?.replace('email_', '').replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {campaign.subject_lines?.length || 0} subjects
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Goal: {campaign.campaign_goal} • Voice: {campaign.brand_voice} • Read time: {campaign.estimated_read_time}min
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        Created: {new Date(campaign.created_at).toLocaleDateString()}
                      </p>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyToClipboard(campaign.email_content)}
                          variant="outline"
                          size="sm"
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Content
                        </Button>
                        {campaign.subject_lines && campaign.subject_lines.length > 0 && (
                          <Button
                            onClick={() => copyToClipboard(campaign.subject_lines.join('\n'))}
                            variant="outline"
                            size="sm"
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Subjects
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Mail className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No email campaigns generated yet</p>
                  <p className="text-sm">Create your first email campaign to see it here!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {analytics?.total_campaigns || 0}
                </div>
                <div className="text-sm text-gray-600">Total Campaigns</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Object.keys(analytics?.campaigns_by_type || {}).length}
                </div>
                <div className="text-sm text-gray-600">Email Types</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.keys(analytics?.campaigns_by_goal || {}).length}
                </div>
                <div className="text-sm text-gray-600">Campaign Goals</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(analytics?.avg_read_time || 0)}m
                </div>
                <div className="text-sm text-gray-600">Avg Read Time</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analytics?.campaigns_by_type && Object.keys(analytics.campaigns_by_type).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    By Email Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analytics.campaigns_by_type).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="capitalize">{type.replace('email_', '').replace('_', ' ')}</span>
                        <Badge variant="outline">{count} campaigns</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {analytics?.campaigns_by_goal && Object.keys(analytics.campaigns_by_goal).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    By Campaign Goal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analytics.campaigns_by_goal).map(([goal, count]) => (
                      <div key={goal} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{getGoalIcon(goal)}</span>
                          <span className="capitalize">{goal}</span>
                        </div>
                        <Badge variant="outline">{count} campaigns</Badge>
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

export default EmailMarketingStudio;