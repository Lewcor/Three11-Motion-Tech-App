import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { 
  Database, 
  Plus, 
  Settings, 
  Users, 
  TrendingUp,
  Mail,
  Building,
  Phone,
  Star,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  UserCheck,
  Zap,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';

const CRMIntegration = () => {
  const [integrations, setIntegrations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('integrations');
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [syncing, setSyncing] = useState({});
  const [connectionForm, setConnectionForm] = useState({
    platform: '',
    api_key: '',
    base_url: '',
    organization_id: ''
  });

  // Mock data loading
  useEffect(() => {
    const mockData = {
      integrations: [
        {
          id: 'integration_1',
          platform: 'hubspot',
          organization_id: 'hubspot_org_123',
          status: 'active',
          sync_frequency: 'daily',
          last_sync: new Date(Date.now() - 2 * 60 * 60 * 1000),
          settings: {
            sync_contacts: true,
            sync_deals: true,
            sync_activities: false
          },
          connected_at: new Date('2024-05-01')
        },
        {
          id: 'integration_2',
          platform: 'salesforce',
          base_url: 'https://mycompany.salesforce.com',
          status: 'active',
          sync_frequency: 'hourly',
          last_sync: new Date(Date.now() - 30 * 60 * 1000),
          settings: {
            sync_contacts: true,
            sync_opportunities: true,
            custom_fields: ['Social_Media_Score__c', 'Content_Preferences__c']
          },
          connected_at: new Date('2024-04-15')
        }
      ],
      contacts: [
        {
          id: 'contact_1',
          crm_contact_id: 'contact_001',
          email: 'sarah.martinez@fashionco.com',
          first_name: 'Sarah',
          last_name: 'Martinez',
          company: 'Fashion Co',
          phone: '+1-555-0123',
          social_profiles: {
            instagram: '@sarahstyle',
            linkedin: 'sarah-martinez-fashion'
          },
          engagement_score: 8.5,
          content_preferences: ['fashion', 'lifestyle', 'trends'],
          deal_stage: 'qualified_lead',
          lead_score: 85,
          tags: ['vip_customer', 'fashion_influencer'],
          last_interaction: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'contact_2',
          crm_contact_id: 'contact_002',
          email: 'michael.chen@retailbrand.com',
          first_name: 'Michael',
          last_name: 'Chen',
          company: 'Retail Brand',
          phone: '+1-555-0456',
          social_profiles: {
            twitter: '@michaelchen',
            linkedin: 'michael-chen-retail'
          },
          engagement_score: 7.2,
          content_preferences: ['business', 'retail', 'marketing'],
          deal_stage: 'opportunity',
          lead_score: 72,
          tags: ['enterprise_client', 'retail_expert'],
          last_interaction: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'contact_3',
          crm_contact_id: 'contact_003',
          email: 'emma.johnson@startupfashion.com',
          first_name: 'Emma',
          last_name: 'Johnson',
          company: 'Startup Fashion',
          phone: '+1-555-0789',
          social_profiles: {
            instagram: '@emmajfashion',
            tiktok: '@emmastyle'
          },
          engagement_score: 9.1,
          content_preferences: ['startups', 'fashion', 'entrepreneurship'],
          deal_stage: 'closed_won',
          lead_score: 91,
          tags: ['startup_founder', 'high_engagement'],
          last_interaction: new Date(Date.now() - 6 * 60 * 60 * 1000)
        }
      ],
      insights: {
        contact_engagement: {
          total_contacts: 156,
          active_contacts: 98,
          high_engagement_contacts: 34,
          avg_engagement_score: 6.8,
          engagement_growth: 12.5
        },
        social_crm_correlation: {
          contacts_with_social_profiles: 87,
          social_engagement_conversion_rate: 23.4,
          avg_deal_size_with_social: 15000,
          avg_deal_size_without_social: 8500
        },
        content_performance_by_audience: [
          {
            audience_segment: 'VIP Customers',
            preferred_content: ['exclusive_previews', 'behind_the_scenes'],
            engagement_rate: 8.9,
            conversion_rate: 34.2
          },
          {
            audience_segment: 'Enterprise Clients',
            preferred_content: ['case_studies', 'industry_insights'],
            engagement_rate: 6.4,
            conversion_rate: 28.7
          },
          {
            audience_segment: 'Startup Founders',
            preferred_content: ['growth_tips', 'success_stories'],
            engagement_rate: 9.3,
            conversion_rate: 31.8
          }
        ]
      }
    };

    setTimeout(() => {
      setIntegrations(mockData.integrations);
      setContacts(mockData.contacts);
      setInsights(mockData.insights);
      setLoading(false);
    }, 1000);
  }, []);

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'hubspot':
        return <div className="w-6 h-6 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">H</div>;
      case 'salesforce':
        return <div className="w-6 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">S</div>;
      case 'pipedrive':
        return <div className="w-6 h-6 bg-green-500 rounded text-white text-xs flex items-center justify-center font-bold">P</div>;
      case 'zoho':
        return <div className="w-6 h-6 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">Z</div>;
      case 'monday':
        return <div className="w-6 h-6 bg-purple-500 rounded text-white text-xs flex items-center justify-center font-bold">M</div>;
      case 'airtable':
        return <div className="w-6 h-6 bg-yellow-500 rounded text-white text-xs flex items-center justify-center font-bold">A</div>;
      default:
        return <Database className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'inactive':
        return <Clock className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDealStageColor = (stage) => {
    switch (stage) {
      case 'qualified_lead':
        return 'bg-blue-100 text-blue-800';
      case 'opportunity':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed_won':
        return 'bg-green-100 text-green-800';
      case 'closed_lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEngagementColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleConnectCRM = async (e) => {
    e.preventDefault();
    
    const newIntegration = {
      id: `integration_${Date.now()}`,
      platform: connectionForm.platform,
      base_url: connectionForm.base_url,
      organization_id: connectionForm.organization_id,
      status: 'active',
      sync_frequency: 'daily',
      last_sync: new Date(),
      settings: {
        sync_contacts: true,
        sync_deals: true
      },
      connected_at: new Date()
    };

    setIntegrations(prev => [...prev, newIntegration]);
    setConnectionForm({
      platform: '',
      api_key: '',
      base_url: '',
      organization_id: ''
    });
    setShowConnectDialog(false);
  };

  const handleSyncIntegration = async (integrationId) => {
    setSyncing(prev => ({ ...prev, [integrationId]: true }));
    
    // Simulate sync
    setTimeout(() => {
      setIntegrations(prev => prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, last_sync: new Date() }
          : integration
      ));
      setSyncing(prev => ({ ...prev, [integrationId]: false }));
    }, 3000);
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading CRM integration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CRM Integration
          </h1>
          <p className="text-gray-600">Connect your CRM to sync contacts and track social media engagement</p>
        </div>
        <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Connect CRM
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect CRM Platform</DialogTitle>
              <DialogDescription>
                Connect your CRM to sync contacts and enhance social media targeting
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleConnectCRM} className="space-y-4">
              <div>
                <Label htmlFor="platform">CRM Platform</Label>
                <Select value={connectionForm.platform} onValueChange={(value) => setConnectionForm(prev => ({ ...prev, platform: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select CRM platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hubspot">HubSpot</SelectItem>
                    <SelectItem value="salesforce">Salesforce</SelectItem>
                    <SelectItem value="pipedrive">Pipedrive</SelectItem>
                    <SelectItem value="zoho">Zoho CRM</SelectItem>
                    <SelectItem value="monday">Monday.com</SelectItem>
                    <SelectItem value="airtable">Airtable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={connectionForm.api_key}
                  onChange={(e) => setConnectionForm(prev => ({ ...prev, api_key: e.target.value }))}
                  placeholder="Enter your API key"
                  required
                />
              </div>
              
              {connectionForm.platform === 'salesforce' && (
                <div>
                  <Label htmlFor="base-url">Instance URL</Label>
                  <Input
                    id="base-url"
                    value={connectionForm.base_url}
                    onChange={(e) => setConnectionForm(prev => ({ ...prev, base_url: e.target.value }))}
                    placeholder="https://yourcompany.salesforce.com"
                  />
                </div>
              )}
              
              {connectionForm.platform === 'hubspot' && (
                <div>
                  <Label htmlFor="organization-id">Organization ID</Label>
                  <Input
                    id="organization-id"
                    value={connectionForm.organization_id}
                    onChange={(e) => setConnectionForm(prev => ({ ...prev, organization_id: e.target.value }))}
                    placeholder="Enter organization ID"
                  />
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1" disabled={!connectionForm.platform || !connectionForm.api_key}>
                  Connect CRM
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowConnectDialog(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-fit lg:grid-cols-3">
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Contacts ({contacts.length})
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    {getPlatformIcon(integration.platform)}
                    <span className="capitalize">{integration.platform}</span>
                    <div className="ml-auto flex items-center gap-1">
                      {getStatusIcon(integration.status)}
                      <Badge className={integration.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {integration.status}
                      </Badge>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Connected {formatTimeAgo(integration.connected_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Sync Frequency</span>
                      <span className="font-medium capitalize">{integration.sync_frequency}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last Sync</span>
                      <span className="font-medium">{formatTimeAgo(integration.last_sync)}</span>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleSyncIntegration(integration.id)}
                        disabled={syncing[integration.id]}
                      >
                        {syncing[integration.id] ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                        ) : (
                          <Sync className="h-3 w-3 mr-2" />
                        )}
                        Sync Now
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add New Integration Card */}
            <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors cursor-pointer" onClick={() => setShowConnectDialog(true)}>
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <Plus className="h-8 w-8 text-gray-400 mb-3" />
                <h3 className="font-semibold mb-2">Connect New CRM</h3>
                <p className="text-sm text-gray-600">Add another CRM platform</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
          
          <div className="grid gap-4">
            {contacts.map((contact) => (
              <Card key={contact.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {contact.first_name?.charAt(0)}{contact.last_name?.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{contact.first_name} {contact.last_name}</h3>
                          <Badge className={getDealStageColor(contact.deal_stage)}>
                            {contact.deal_stage?.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            <span>{contact.email}</span>
                          </div>
                          {contact.company && (
                            <div className="flex items-center gap-2">
                              <Building className="h-3 w-3" />
                              <span>{contact.company}</span>
                            </div>
                          )}
                          {contact.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3" />
                              <span>{contact.phone}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm text-gray-600">Social:</span>
                          {Object.entries(contact.social_profiles).map(([platform, username]) => (
                            <Badge key={platform} variant="secondary" className="text-xs">
                              {platform}: {username}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm text-gray-600">Interests:</span>
                          {contact.content_preferences.slice(0, 3).map((pref) => (
                            <Badge key={pref} variant="outline" className="text-xs">
                              {pref}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className={`font-semibold ${getEngagementColor(contact.engagement_score)}`}>
                          {contact.engagement_score}/10
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Lead Score: {contact.lead_score}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Last interaction: {formatTimeAgo(contact.last_interaction)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {insights && (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{insights.contact_engagement.total_contacts}</div>
                    <p className="text-xs text-muted-foreground">
                      {insights.contact_engagement.active_contacts} active
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{insights.contact_engagement.avg_engagement_score}/10</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+{insights.contact_engagement.engagement_growth}%</span> growth
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Social Conversion</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{insights.social_crm_correlation.social_engagement_conversion_rate}%</div>
                    <p className="text-xs text-muted-foreground">
                      Social to lead conversion
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Deal Size Impact</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${(insights.social_crm_correlation.avg_deal_size_with_social / 1000).toFixed(0)}K
                    </div>
                    <p className="text-xs text-muted-foreground">
                      With social engagement
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Content Performance by Audience */}
              <Card>
                <CardHeader>
                  <CardTitle>Content Performance by Audience</CardTitle>
                  <CardDescription>How different audience segments engage with your content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {insights.content_performance_by_audience.map((segment, index) => (
                      <div key={index} className="p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{segment.audience_segment}</h4>
                          <div className="flex gap-4 text-sm">
                            <span className="text-blue-600 font-medium">
                              {segment.engagement_rate}% engagement
                            </span>
                            <span className="text-green-600 font-medium">
                              {segment.conversion_rate}% conversion
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">Preferred Content:</p>
                          <div className="flex gap-2">
                            {segment.preferred_content.map((content) => (
                              <Badge key={content} variant="secondary" className="text-xs">
                                {content.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Engagement Rate</span>
                            <span>{segment.engagement_rate}%</span>
                          </div>
                          <Progress value={segment.engagement_rate} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Social vs Non-Social Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Social Media Impact</CardTitle>
                    <CardDescription>Contacts with vs without social media engagement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-green-50">
                        <div>
                          <p className="font-medium text-green-800">With Social Engagement</p>
                          <p className="text-sm text-green-600">
                            {insights.social_crm_correlation.contacts_with_social_profiles} contacts
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-800">
                            ${(insights.social_crm_correlation.avg_deal_size_with_social / 1000).toFixed(0)}K
                          </p>
                          <p className="text-xs text-green-600">avg deal size</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-800">Without Social Engagement</p>
                          <p className="text-sm text-gray-600">
                            {insights.contact_engagement.total_contacts - insights.social_crm_correlation.contacts_with_social_profiles} contacts
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">
                            ${(insights.social_crm_correlation.avg_deal_size_without_social / 1000).toFixed(0)}K
                          </p>
                          <p className="text-xs text-gray-600">avg deal size</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Engagement Distribution</CardTitle>
                    <CardDescription>Contact engagement levels across your CRM</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>High Engagement (8-10)</span>
                          <span className="font-medium">{insights.contact_engagement.high_engagement_contacts}</span>
                        </div>
                        <Progress value={(insights.contact_engagement.high_engagement_contacts / insights.contact_engagement.total_contacts) * 100} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Medium Engagement (5-7)</span>
                          <span className="font-medium">
                            {insights.contact_engagement.active_contacts - insights.contact_engagement.high_engagement_contacts}
                          </span>
                        </div>
                        <Progress value={((insights.contact_engagement.active_contacts - insights.contact_engagement.high_engagement_contacts) / insights.contact_engagement.total_contacts) * 100} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Low/No Engagement (0-4)</span>
                          <span className="font-medium">
                            {insights.contact_engagement.total_contacts - insights.contact_engagement.active_contacts}
                          </span>
                        </div>
                        <Progress value={((insights.contact_engagement.total_contacts - insights.contact_engagement.active_contacts) / insights.contact_engagement.total_contacts) * 100} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMIntegration;