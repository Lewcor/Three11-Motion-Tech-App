import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Switch } from './ui/switch';
import { 
  Zap, 
  Plus, 
  Settings, 
  Clock, 
  TrendingUp, 
  Users, 
  Heart,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Edit,
  Trash2,
  Calendar,
  Target,
  Mail,
  Bell,
  BarChart3,
  Workflow,
  Star,
  AlertTriangle
} from 'lucide-react';

const AutomationWorkflows = () => {
  const [workflows, setWorkflows] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [workflowForm, setWorkflowForm] = useState({
    name: '',
    description: '',
    trigger: '',
    trigger_conditions: {},
    actions: [],
    is_active: true
  });

  // Mock data loading
  useEffect(() => {
    const mockData = {
      workflows: [
        {
          id: 'workflow_1',
          name: 'Auto-post High Engagement Content',
          description: 'Automatically republish content when it reaches 500+ likes',
          trigger: 'engagement_threshold',
          trigger_conditions: {
            metric: 'likes',
            threshold: 500,
            platform: 'instagram'
          },
          actions: [
            {
              action_type: 'republish_content',
              platforms: ['facebook', 'twitter'],
              delay_hours: 2
            },
            {
              action_type: 'update_crm',
              field: 'high_performing_content',
              value: true
            }
          ],
          is_active: true,
          execution_count: 12,
          last_executed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          created_at: new Date('2024-05-01')
        },
        {
          id: 'workflow_2',
          name: 'Weekly Content Digest',
          description: 'Send weekly digest of top-performing content',
          trigger: 'schedule',
          trigger_conditions: {
            schedule: 'weekly',
            day: 'sunday',
            time: '09:00'
          },
          actions: [
            {
              action_type: 'generate_report',
              report_type: 'weekly_digest',
              metrics: ['engagement_rate', 'reach', 'saves']
            },
            {
              action_type: 'send_email',
              recipients: ['team@example.com'],
              template: 'weekly_digest'
            }
          ],
          is_active: true,
          execution_count: 8,
          last_executed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          created_at: new Date('2024-04-15')
        },
        {
          id: 'workflow_3',
          name: 'Follower Milestone Celebration',
          description: 'Create celebration post when reaching follower milestones',
          trigger: 'follower_milestone',
          trigger_conditions: {
            milestone_type: 'thousand',
            platforms: ['instagram', 'tiktok']
          },
          actions: [
            {
              action_type: 'create_post',
              content_template: 'milestone_celebration',
              platforms: ['instagram', 'facebook', 'twitter']
            },
            {
              action_type: 'notify_team',
              message: 'Follower milestone reached! Celebration post created.'
            }
          ],
          is_active: true,
          execution_count: 3,
          last_executed: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          created_at: new Date('2024-03-20')
        },
        {
          id: 'workflow_4',
          name: 'Content Approval Reminder',
          description: 'Send reminders for pending content approvals',
          trigger: 'content_approval',
          trigger_conditions: {
            pending_duration_hours: 24,
            priority: 'high'
          },
          actions: [
            {
              action_type: 'send_notification',
              recipients: ['approver@example.com'],
              message: 'Content approval pending for 24+ hours'
            },
            {
              action_type: 'update_status',
              status: 'urgent'
            }
          ],
          is_active: false,
          execution_count: 15,
          last_executed: new Date(Date.now() - 8 * 60 * 60 * 1000),
          created_at: new Date('2024-02-10')
        }
      ],
      analytics: {
        workflow_performance: {
          total_workflows: 4,
          active_workflows: 3,
          total_executions: 38,
          successful_executions: 35,
          failed_executions: 3,
          success_rate: 92.1,
          avg_execution_time: 2.3
        },
        time_savings: {
          estimated_manual_hours_saved: 47.5,
          avg_hours_saved_per_week: 12.3,
          tasks_automated: 38,
          efficiency_improvement: 78.2
        },
        top_performing_workflows: [
          {
            name: 'Auto-post High Engagement Content',
            executions: 12,
            success_rate: 100.0,
            avg_engagement_boost: 45.2
          },
          {
            name: 'Weekly Content Digest',
            executions: 8,
            success_rate: 87.5,
            time_saved_hours: 16.0
          }
        ]
      }
    };

    setTimeout(() => {
      setWorkflows(mockData.workflows);
      setAnalytics(mockData.analytics);
      setLoading(false);
    }, 1000);
  }, []);

  const getTriggerIcon = (trigger) => {
    switch (trigger) {
      case 'schedule':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'engagement_threshold':
        return <Heart className="h-4 w-4 text-pink-500" />;
      case 'follower_milestone':
        return <Users className="h-4 w-4 text-green-500" />;
      case 'content_approval':
        return <CheckCircle className="h-4 w-4 text-purple-500" />;
      default:
        return <Zap className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'publish_post':
      case 'republish_content':
        return <Target className="h-3 w-3" />;
      case 'send_email':
        return <Mail className="h-3 w-3" />;
      case 'notify_team':
        return <Bell className="h-3 w-3" />;
      case 'generate_report':
        return <BarChart3 className="h-3 w-3" />;
      default:
        return <Settings className="h-3 w-3" />;
    }
  };

  const getTriggerDescription = (workflow) => {
    switch (workflow.trigger) {
      case 'schedule':
        return `Every ${workflow.trigger_conditions.schedule} on ${workflow.trigger_conditions.day} at ${workflow.trigger_conditions.time}`;
      case 'engagement_threshold':
        return `When ${workflow.trigger_conditions.metric} reaches ${workflow.trigger_conditions.threshold}+ on ${workflow.trigger_conditions.platform}`;
      case 'follower_milestone':
        return `When reaching ${workflow.trigger_conditions.milestone_type} follower milestones`;
      case 'content_approval':
        return `When content pending approval for ${workflow.trigger_conditions.pending_duration_hours}+ hours`;
      default:
        return 'Custom trigger condition';
    }
  };

  const handleCreateWorkflow = async (e) => {
    e.preventDefault();
    
    const newWorkflow = {
      id: `workflow_${Date.now()}`,
      name: workflowForm.name,
      description: workflowForm.description,
      trigger: workflowForm.trigger,
      trigger_conditions: workflowForm.trigger_conditions,
      actions: workflowForm.actions,
      is_active: workflowForm.is_active,
      execution_count: 0,
      last_executed: null,
      created_at: new Date()
    };

    setWorkflows(prev => [...prev, newWorkflow]);
    
    // Reset form
    setWorkflowForm({
      name: '',
      description: '',
      trigger: '',
      trigger_conditions: {},
      actions: [],
      is_active: true
    });
    setShowCreateDialog(false);
  };

  const toggleWorkflow = async (workflowId, isActive) => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === workflowId 
        ? { ...workflow, is_active: isActive }
        : workflow
    ));
  };

  const executeWorkflow = async (workflowId) => {
    // Simulate workflow execution
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === workflowId 
        ? { 
            ...workflow, 
            execution_count: workflow.execution_count + 1,
            last_executed: new Date()
          }
        : workflow
    ));
  };

  const formatTimeAgo = (date) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading automation workflows...</p>
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
            Automation Workflows
          </h1>
          <p className="text-gray-600">Automate your social media tasks and save time</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Workflow
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Automation Workflow</DialogTitle>
              <DialogDescription>
                Set up automated actions based on triggers and conditions
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateWorkflow} className="space-y-6">
              <div>
                <Label htmlFor="workflow-name">Workflow Name</Label>
                <Input
                  id="workflow-name"
                  value={workflowForm.name}
                  onChange={(e) => setWorkflowForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Auto-share top content"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="workflow-description">Description</Label>
                <Textarea
                  id="workflow-description"
                  value={workflowForm.description}
                  onChange={(e) => setWorkflowForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this workflow does"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="trigger">Trigger</Label>
                <Select value={workflowForm.trigger} onValueChange={(value) => setWorkflowForm(prev => ({ ...prev, trigger: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="schedule">Schedule</SelectItem>
                    <SelectItem value="engagement_threshold">Engagement Threshold</SelectItem>
                    <SelectItem value="follower_milestone">Follower Milestone</SelectItem>
                    <SelectItem value="content_approval">Content Approval</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-active"
                  checked={workflowForm.is_active}
                  onCheckedChange={(checked) => setWorkflowForm(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is-active">Activate workflow immediately</Label>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1" disabled={!workflowForm.name || !workflowForm.trigger}>
                  Create Workflow
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.workflow_performance.active_workflows}</div>
              <p className="text-xs text-muted-foreground">
                of {analytics.workflow_performance.total_workflows} total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.workflow_performance.success_rate}%</div>
              <p className="text-xs text-muted-foreground">
                {analytics.workflow_performance.successful_executions} of {analytics.workflow_performance.total_executions} executions
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.time_savings.estimated_manual_hours_saved}h</div>
              <p className="text-xs text-muted-foreground">
                {analytics.time_savings.avg_hours_saved_per_week}h per week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Efficiency Gain</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.time_savings.efficiency_improvement}%</div>
              <p className="text-xs text-muted-foreground">
                {analytics.time_savings.tasks_automated} tasks automated
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Workflows List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Workflows</h2>
        {workflows.map((workflow) => (
          <Card key={workflow.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getTriggerIcon(workflow.trigger)}
                    <h3 className="font-semibold text-lg">{workflow.name}</h3>
                    <Badge className={workflow.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {workflow.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{workflow.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Trigger:</span>
                      <span className="font-medium">{getTriggerDescription(workflow)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Actions:</span>
                      <div className="flex gap-2">
                        {workflow.actions.slice(0, 3).map((action, index) => (
                          <Badge key={index} variant="secondary" className="text-xs flex items-center gap-1">
                            {getActionIcon(action.action_type)}
                            {action.action_type.replace('_', ' ')}
                          </Badge>
                        ))}
                        {workflow.actions.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{workflow.actions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-gray-600">
                      <span>Executed {workflow.execution_count} times</span>
                      <span>Last run: {formatTimeAgo(workflow.last_executed)}</span>
                      <span>Created: {workflow.created_at.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Switch
                    checked={workflow.is_active}
                    onCheckedChange={(checked) => toggleWorkflow(workflow.id, checked)}
                  />
                  
                  {workflow.is_active && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => executeWorkflow(workflow.id)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {workflows.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Workflow className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No automation workflows yet</h3>
              <p className="text-gray-600 mb-4">Create your first workflow to start automating your social media tasks</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Workflow
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Top Performing Workflows */}
      {analytics && analytics.top_performing_workflows.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Top Performing Workflows</CardTitle>
            <CardDescription>Your most effective automation workflows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.top_performing_workflows.map((workflow, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold">{workflow.name}</h4>
                      <p className="text-sm text-gray-600">
                        {workflow.executions} executions • {workflow.success_rate}% success rate
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {workflow.avg_engagement_boost && (
                      <p className="font-medium text-green-600">
                        +{workflow.avg_engagement_boost}% engagement
                      </p>
                    )}
                    {workflow.time_saved_hours && (
                      <p className="font-medium text-blue-600">
                        {workflow.time_saved_hours}h saved
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AutomationWorkflows;